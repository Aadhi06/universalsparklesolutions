"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import {
  canManageUsers,
  createUser,
  deleteUser,
  setUserActive,
  setUserPassword,
  userRoles,
  type UserRole,
} from "@/lib/store/users";

async function requireManager() {
  const session = await requireAdmin();
  if (!(await canManageUsers(session.sub))) {
    throw new Error("Only an admin can manage staff logins.");
  }
  return session;
}

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createUserAction(formData: FormData) {
  await requireManager();
  const role = text(formData.get("role")) as UserRole;
  try {
    await createUser({
      name: text(formData.get("name")),
      username: text(formData.get("username")),
      password: String(formData.get("password") ?? ""),
      role: userRoles.includes(role) ? role : "Staff",
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not create the user." };
  }
  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function setUserPasswordAction(formData: FormData) {
  await requireManager();
  await setUserPassword(text(formData.get("id")), String(formData.get("password") ?? ""));
  revalidatePath("/admin/users");
}

export async function setUserActiveAction(formData: FormData) {
  await requireManager();
  await setUserActive(text(formData.get("id")), text(formData.get("active")) === "true");
  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData) {
  await requireManager();
  await deleteUser(text(formData.get("id")));
  revalidatePath("/admin/users");
}
