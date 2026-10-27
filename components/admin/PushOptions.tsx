"use client";

import { useEffect, useState } from "react";
import {
  clearStoredPushFlags,
  getAdminServiceWorker,
  readStoredPushFlags,
  urlBase64ToUint8Array,
  writeStoredPushFlags,
  type PushFlags,
} from "@/lib/admin/pushClient";

export function PushOptions() {
  const [flags, setFlags] = useState<PushFlags>({ enquiries: false, appointments: false });
  const [configured, setConfigured] = useState(true);
  const [supported, setSupported] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const stored = readStoredPushFlags();
      if (stored && (stored.enquiries || stored.appointments) && !cancelled) {
        setFlags(stored);
      }

      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        if (!cancelled) setSupported(false);
        return;
      }

      const response = await fetch("/api/admin/push");
      if (!response.ok) return;
      const data = (await response.json()) as {
        configured: boolean;
        publicKey: string;
        subscriptions: Array<PushFlags & { endpoint: string }>;
      };
      if (cancelled) return;
      setConfigured(data.configured);

      const registration = await getAdminServiceWorker();
      if (!registration || cancelled) return;

      let subscription = await registration.pushManager.getSubscription();
      const match = data.subscriptions.find((item) => item.endpoint === subscription?.endpoint);

      let nextFlags: PushFlags = { enquiries: false, appointments: false };
      if (match) {
        nextFlags = { enquiries: match.enquiries, appointments: match.appointments };
      } else if (stored && (stored.enquiries || stored.appointments)) {
        nextFlags = stored;
      }

      // Keep server copy in sync whenever this device still wants alerts.
      if (data.configured && (nextFlags.enquiries || nextFlags.appointments)) {
        if (Notification.permission === "granted") {
          if (!subscription) {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(data.publicKey),
            });
          }
          if (subscription) {
            await fetch("/api/admin/push", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscription: subscription.toJSON(),
                enquiries: nextFlags.enquiries,
                appointments: nextFlags.appointments,
              }),
            });
          }
        }
      }

      if (!cancelled) {
        setFlags(nextFlags);
        writeStoredPushFlags(nextFlags);
        setReady(true);
      }
    }

    load()
      .catch(() => {
        if (!cancelled) setMessage("Notifications could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function update(next: PushFlags) {
    setBusy(true);
    setMessage("");
    const previous = flags;
    setFlags(next);
    writeStoredPushFlags(next);

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("This browser cannot receive push notifications.");
      }

      const registration = await getAdminServiceWorker();
      if (!registration) {
        throw new Error("This browser cannot receive push notifications.");
      }

      let subscription = await registration.pushManager.getSubscription();
      const enabled = next.enquiries || next.appointments;

      if (enabled && Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          throw new Error("Allow notifications for this site, then try again.");
        }
      }

      if (enabled && !subscription) {
        const response = await fetch("/api/admin/push");
        const data = (await response.json()) as { configured: boolean; publicKey: string };
        if (!data.configured || !data.publicKey) {
          throw new Error("Push notifications are not configured on this server.");
        }
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });
      }

      if (!subscription) {
        if (enabled) throw new Error("Could not create a push subscription.");
        clearStoredPushFlags();
        return;
      }

      const response = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          enquiries: next.enquiries,
          appointments: next.appointments,
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message || "Could not save the notification setting.");
      }

      // Only remove the browser subscription when both topics are turned off.
      if (!enabled) {
        await subscription.unsubscribe();
        clearStoredPushFlags();
      } else {
        writeStoredPushFlags(next);
      }

      setMessage(enabled ? "Notifications saved on this device." : "Notifications turned off.");
    } catch (error) {
      setFlags(previous);
      writeStoredPushFlags(previous);
      setMessage(error instanceof Error ? error.message : "Could not update notifications.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[6px] border border-line bg-white p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold text-navy">Push notifications</h2>
      <p className="mt-1 text-sm text-body">
        Alerts on this phone for new enquiries and appointment changes. Once enabled, they stay on
        until you turn them off. On iPhone, add USS Admin to the home screen first.
      </p>
      {!supported ? (
        <p className="mt-3 text-sm text-navy">
          This browser cannot receive push notifications.
        </p>
      ) : !configured ? (
        <p className="mt-3 text-sm text-navy">
          Add the VAPID keys on the server before notifications can be turned on.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Switch
            label="Enquiries"
            checked={flags.enquiries}
            disabled={busy || !ready}
            onChange={(enquiries) => update({ ...flags, enquiries })}
          />
          <Switch
            label="Appointments"
            checked={flags.appointments}
            disabled={busy || !ready}
            onChange={(appointments) => update({ ...flags, appointments })}
          />
        </div>
      )}
      {message ? <p className="mt-3 text-sm text-navy">{message}</p> : null}
    </section>
  );
}

function Switch({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-[6px] border border-line px-3 text-left disabled:cursor-wait"
    >
      <span className="font-semibold text-navy">{label}</span>
      <span
        className={`relative h-7 w-12 rounded-full ${checked ? "bg-blue" : "bg-line"}`}
        aria-hidden
      >
        <span
          className={`absolute top-0.5 size-6 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
