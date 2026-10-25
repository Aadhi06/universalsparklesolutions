import { readJsonFile, writeJsonFile } from "@/lib/store/io";

export const appointmentStatuses = [
  "Scheduled",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export type Appointment = {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  date: string;
  time: string;
  status: AppointmentStatus | string;
  notes: string;
  enquiryId?: string;
};

const FILE = "appointments.json";

export async function listAppointments() {
  const items = await readJsonFile<Appointment[]>(FILE, []);
  return [...items].sort((a, b) => {
    const left = `${a.date}T${a.time}`;
    const right = `${b.date}T${b.time}`;
    return left.localeCompare(right);
  });
}

export async function getAppointment(id: string) {
  const items = await listAppointments();
  return items.find((item) => item.id === id) ?? null;
}

export async function upsertAppointment(appointment: Appointment) {
  const items = await readJsonFile<Appointment[]>(FILE, []);
  const index = items.findIndex((item) => item.id === appointment.id);
  if (index === -1) items.push(appointment);
  else items[index] = appointment;
  await writeJsonFile(FILE, items);
  return appointment;
}

export async function deleteAppointment(id: string) {
  return (await deleteAppointments([id])) > 0;
}

export async function setAppointmentStatuses(ids: string[], status: string) {
  const selected = new Set(ids);
  const items = await readJsonFile<Appointment[]>(FILE, []);
  let changed = 0;
  const next = items.map((item) => {
    if (!selected.has(item.id) || item.status === status) return item;
    changed += 1;
    return { ...item, status };
  });
  if (changed > 0) await writeJsonFile(FILE, next);
  return changed;
}

export async function deleteAppointments(ids: string[]) {
  const selected = new Set(ids);
  const items = await readJsonFile<Appointment[]>(FILE, []);
  const next = items.filter((item) => !selected.has(item.id));
  const removed = items.length - next.length;
  if (removed > 0) await writeJsonFile(FILE, next);
  return removed;
}

export function melbourneToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
