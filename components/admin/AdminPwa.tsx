"use client";

import { useEffect } from "react";
import { getAdminServiceWorker } from "@/lib/admin/pushClient";

export function AdminPwa() {
  useEffect(() => {
    getAdminServiceWorker().catch(() => {
      // Install still works once the browser can reach the worker.
    });
  }, []);

  return null;
}
