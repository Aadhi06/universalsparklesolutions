const STORAGE_KEY = "uss-admin-push-flags";

export type PushFlags = {
  enquiries: boolean;
  appointments: boolean;
};

export function readStoredPushFlags(): PushFlags | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PushFlags>;
    return {
      enquiries: Boolean(parsed.enquiries),
      appointments: Boolean(parsed.appointments),
    };
  } catch {
    return null;
  }
}

export function writeStoredPushFlags(flags: PushFlags) {
  try {
    if (!flags.enquiries && !flags.appointments) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  } catch {
    // Private browsing may block localStorage.
  }
}

export function clearStoredPushFlags() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export async function getAdminServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  let registration = await navigator.serviceWorker.getRegistration("/admin/");
  if (!registration) {
    registration = await navigator.serviceWorker.register("/admin/sw.js", {
      scope: "/admin/",
    });
  }
  await registration.update().catch(() => undefined);
  return registration;
}

export function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    output[index] = raw.charCodeAt(index);
  }
  return output;
}
