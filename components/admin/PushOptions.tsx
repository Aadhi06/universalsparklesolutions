"use client";

import { useEffect, useState } from "react";

type Flags = {
  enquiries: boolean;
  appointments: boolean;
};

export function PushOptions() {
  const [flags, setFlags] = useState<Flags>({ enquiries: false, appointments: false });
  const [configured, setConfigured] = useState(true);
  const [supported, setSupported] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        if (!cancelled) setSupported(false);
        return;
      }

      const response = await fetch("/api/admin/push");
      if (!response.ok) return;
      const data = (await response.json()) as {
        configured: boolean;
        subscriptions: Array<Flags & { endpoint: string }>;
      };
      if (cancelled) return;
      setConfigured(data.configured);

      const registration = await navigator.serviceWorker.getRegistration("/admin/");
      const current = await registration?.pushManager.getSubscription();
      const match = data.subscriptions.find((item) => item.endpoint === current?.endpoint);
      if (!cancelled && match) {
        setFlags({ enquiries: match.enquiries, appointments: match.appointments });
      }
    }

    load().catch(() => {
      if (!cancelled) setMessage("Notifications could not be loaded.");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function update(next: Flags) {
    setBusy(true);
    setMessage("");
    const previous = flags;
    setFlags(next);

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("This browser cannot receive push notifications.");
      }

      const registration = await navigator.serviceWorker.ready;
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

      if (subscription) {
        await fetch("/api/admin/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: subscription.toJSON(),
            enquiries: next.enquiries,
            appointments: next.appointments,
          }),
        }).then(async (response) => {
          if (!response.ok) {
            const data = (await response.json().catch(() => ({}))) as { message?: string };
            throw new Error(data.message || "Could not save the notification setting.");
          }
        });
      }

      if (!enabled && subscription) {
        await subscription.unsubscribe();
      }
    } catch (error) {
      setFlags(previous);
      setMessage(error instanceof Error ? error.message : "Could not update notifications.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[6px] border border-line bg-white p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold text-navy">Push notifications</h2>
      <p className="mt-1 text-sm text-body">
        Alerts on this phone for new enquiries and appointment changes. On iPhone, add USS
        Admin to the home screen first.
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
            disabled={busy}
            onChange={(enquiries) => update({ ...flags, enquiries })}
          />
          <Switch
            label="Appointments"
            checked={flags.appointments}
            disabled={busy}
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

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    output[index] = raw.charCodeAt(index);
  }
  return output;
}
