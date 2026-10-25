"use client";

import { useEffect } from "react";

export function AdminPwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/admin/sw.js", { scope: "/admin/" }).catch(() => {
      // Install still works once the browser can reach the worker.
    });
  }, []);

  return null;
}
