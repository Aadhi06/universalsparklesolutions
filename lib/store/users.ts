import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { getAdminCredentials } from "@/lib/admin/session";
import { readJsonFile, updateJsonFile } from "@/lib/store/io";

export const userRoles = ["Admin", "Staff"] as const;
export type UserRole = (typeof userRoles)[number];

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};

const FILE = "users.json";

function envUsers(): AdminUser[] {
  const raw = process.env.STAFF_USERS?.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AdminUser[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (user) =>
        user &&
        typeof user.username === "string" &&
        typeof user.passwordHash === "string" &&
        user.active !== false,
    );
  } catch {
    return [];
  }
}

export async function listUsers() {
  const stored = await readJsonFile<AdminUser[]>(FILE, []);
  const taken = new Set(stored.map((user) => user.username.toLowerCase()));
  const extras = envUsers().filter((user) => !taken.has(user.username.toLowerCase()));
  return [...stored, ...extras].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getUserByUsername(username: string) {
  const needle = username.trim().toLowerCase();
  const users = await listUsers();
  return users.find((user) => user.username.toLowerCase() === needle) ?? null;
}

export function isBuiltInAdmin(username: string) {
  return username.trim().toLowerCase() === getAdminCredentials().username.toLowerCase();
}

export async function canManageUsers(username: string) {
  if (isBuiltInAdmin(username)) return true;
  const user = await getUserByUsername(username);
  return Boolean(user?.active && user.role === "Admin");
}

export async function authenticateUser(username: string, password: string) {
  const user = await getUserByUsername(username);
  if (!user || !user.active) return null;
  const matches = await verifyPassword(password, user.passwordHash);
  return matches ? user : null;
}

export async function createUser(input: {
  name: string;
  username: string;
  password: string;
  role: UserRole;
}) {
  const username = input.username.trim().toLowerCase();
  const name = input.name.trim();
  if (!name || username.length < 3 || input.password.length < 8) {
    throw new Error("Enter a name, a username of at least 3 characters, and a password of at least 8 characters.");
  }
  if (!/^[a-z0-9._-]+$/.test(username)) {
    throw new Error("Usernames can use letters, numbers, full stops, hyphens and underscores.");
  }
  if (isBuiltInAdmin(username)) {
    throw new Error("That username is reserved for the server owner account.");
  }
  if (!userRoles.includes(input.role)) {
    throw new Error("Choose Admin or Staff.");
  }

  const passwordHash = await hashPassword(input.password);
  let created: AdminUser | null = null;
  await updateJsonFile<AdminUser[]>(FILE, [], (users) => {
    if (users.some((user) => user.username.toLowerCase() === username)) {
      throw new Error("That username is already in use.");
    }
    created = {
      id: crypto.randomUUID(),
      name,
      username,
      passwordHash,
      role: input.role,
      active: true,
      createdAt: new Date().toISOString(),
    };
    return [...users, created];
  });
  return created;
}

export async function setUserPassword(id: string, password: string) {
  if (password.length < 8) {
    throw new Error("Use a password of at least 8 characters.");
  }
  const passwordHash = await hashPassword(password);
  let found = false;
  await updateJsonFile<AdminUser[]>(FILE, [], (users) =>
    users.map((user) => {
      if (user.id !== id) return user;
      found = true;
      return { ...user, passwordHash };
    }),
  );
  if (!found) throw new Error("User not found.");
}

export async function setUserActive(id: string, active: boolean) {
  await updateUsers(id, (user, users) => {
    if (!active && user.role === "Admin" && countActiveAdmins(users) <= 1) {
      throw new Error("Keep at least one admin who can manage logins.");
    }
    return { ...user, active };
  });
}

export async function deleteUser(id: string) {
  let removed = false;
  await updateJsonFile<AdminUser[]>(FILE, [], (users) => {
    const user = users.find((item) => item.id === id);
    if (!user) return users;
    if (user.role === "Admin" && user.active && countActiveAdmins(users) <= 1) {
      throw new Error("Keep at least one admin who can manage logins.");
    }
    removed = true;
    return users.filter((item) => item.id !== id);
  });
  if (!removed) throw new Error("User not found.");
}

function countActiveAdmins(users: AdminUser[]) {
  return users.filter((user) => user.active && user.role === "Admin").length;
}

async function updateUsers(
  id: string,
  change: (user: AdminUser, users: AdminUser[]) => AdminUser,
) {
  let found = false;
  await updateJsonFile<AdminUser[]>(FILE, [], (users) => {
    const user = users.find((item) => item.id === id);
    if (!user) return users;
    found = true;
    const next = change(user, users);
    return users.map((item) => (item.id === id ? next : item));
  });
  if (!found) throw new Error("User not found.");
}
