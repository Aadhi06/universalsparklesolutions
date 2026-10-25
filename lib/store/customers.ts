import { randomBytes, randomUUID } from "node:crypto";
import { updateJsonFile } from "@/lib/store/io";
import { listEnquiries, type Enquiry } from "@/lib/store/enquiries";

export type Customer = {
  id: string;
  key: string;
  email: string;
  fullName: string;
  company: string;
  phone: string;
  services: string[];
  locations: string[];
  enquiryCount: number;
  latestEnquiryId: string;
  lastEnquiryAt: string;
  createdAt: string;
  marketing: boolean;
  unsubscribeToken: string;
};

type CustomerPref = {
  marketing: boolean;
  unsubscribeToken: string;
  createdAt: string;
};

type CustomerStore = {
  prefs: Record<string, CustomerPref>;
  customers: Customer[];
  hidden: Record<string, string>;
};

const FILE = "customers.json";
const EMPTY: CustomerStore = { prefs: {}, customers: [], hidden: {} };

export function customerCanReceive(customer: Customer) {
  return customer.marketing && customer.email.includes("@");
}

export function customerKey(enquiry: Pick<Enquiry, "email" | "phone">) {
  const email = enquiry.email.trim().toLowerCase();
  if (email.includes("@")) return `email:${email}`;
  const phone = enquiry.phone.replace(/\D/g, "");
  if (phone) return `phone:${phone}`;
  return "";
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function prefFor(prefs: Record<string, CustomerPref>, key: string, createdAt: string) {
  if (!prefs[key]) {
    prefs[key] = {
      marketing: true,
      unsubscribeToken: randomBytes(24).toString("base64url"),
      createdAt,
    };
  }
  return prefs[key];
}

function buildCustomers(enquiries: Enquiry[], store: CustomerStore): CustomerStore {
  const prefs = { ...store.prefs };
  const hidden = { ...(store.hidden ?? {}) };
  const groups = new Map<string, Enquiry[]>();

  for (const enquiry of enquiries) {
    const key = customerKey(enquiry);
    if (!key) continue;
    const group = groups.get(key) ?? [];
    group.push(enquiry);
    groups.set(key, group);
  }

  const previous = new Map(store.customers.map((customer) => [customer.key, customer]));
  const seen = new Set<string>();
  const customers: Customer[] = [];

  for (const [key, items] of groups) {
    const sorted = [...items].sort(
      (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
    );
    const latest = sorted[0];
    if (hidden[key] && latest.receivedAt <= hidden[key]) continue;
    delete hidden[key];
    seen.add(key);

    const oldest = sorted[sorted.length - 1];
    const pref = prefFor(prefs, key, oldest.receivedAt);
    const prior = previous.get(key);
    customers.push({
      id: prior?.id ?? randomUUID(),
      key,
      email: prior?.email || latest.email.trim(),
      fullName: prior?.fullName || latest.fullName.trim() || "Customer",
      company: prior?.company || latest.company.trim(),
      phone: prior?.phone || latest.phone.trim(),
      services: unique([
        ...(prior?.services ?? []),
        ...sorted.map((item) => item.service.trim()),
      ].filter(Boolean)),
      locations: unique([
        ...(prior?.locations ?? []),
        ...sorted.map((item) => item.location.trim()),
      ].filter(Boolean)),
      enquiryCount: items.length,
      latestEnquiryId: latest.id,
      lastEnquiryAt: latest.receivedAt,
      createdAt: pref.createdAt,
      marketing: pref.marketing,
      unsubscribeToken: pref.unsubscribeToken,
    });
  }

  for (const customer of store.customers) {
    if (seen.has(customer.key) || hidden[customer.key]) continue;
    const pref = prefFor(prefs, customer.key, customer.createdAt);
    customers.push({
      ...customer,
      marketing: pref.marketing,
      unsubscribeToken: pref.unsubscribeToken,
    });
  }

  customers.sort(
    (a, b) => new Date(b.lastEnquiryAt).getTime() - new Date(a.lastEnquiryAt).getTime(),
  );
  return { prefs, customers, hidden };
}

export async function syncCustomers() {
  const enquiries = await listEnquiries();
  return updateJsonFile(FILE, EMPTY, (store) => buildCustomers(enquiries, store));
}

export async function listCustomers() {
  const store = await syncCustomers();
  return store.customers;
}

export async function getCustomer(id: string) {
  const customers = await listCustomers();
  return customers.find((customer) => customer.id === id) ?? null;
}

export type CustomerInput = {
  id?: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  marketing: boolean;
};

export async function saveCustomer(input: CustomerInput) {
  const fullName = input.fullName.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const key = customerKey({ email, phone });
  if (!fullName || !key) return null;

  let savedId = input.id ?? "";
  const store = await updateJsonFile(FILE, EMPTY, (current) => {
    const base = {
      prefs: current.prefs ?? {},
      customers: current.customers ?? [],
      hidden: current.hidden ?? {},
    };
    const hidden = { ...base.hidden };
    delete hidden[key];
    const index = input.id
      ? base.customers.findIndex((customer) => customer.id === input.id)
      : base.customers.findIndex((customer) => customer.key === key);
    const prior = index >= 0 ? base.customers[index] : undefined;
    const now = new Date().toISOString();
    const pref = prefFor(base.prefs, key, prior?.createdAt ?? now);
    pref.marketing = input.marketing;
    const next: Customer = {
      id: prior?.id ?? randomUUID(),
      key,
      email,
      fullName,
      company: input.company.trim(),
      phone,
      services: unique([input.service.trim(), ...(prior?.services ?? [])].filter(Boolean)),
      locations: unique([input.location.trim(), ...(prior?.locations ?? [])].filter(Boolean)),
      enquiryCount: prior?.enquiryCount ?? 0,
      latestEnquiryId: prior?.latestEnquiryId ?? "",
      lastEnquiryAt: prior?.lastEnquiryAt ?? now,
      createdAt: pref.createdAt,
      marketing: pref.marketing,
      unsubscribeToken: pref.unsubscribeToken,
    };
    if (prior && prior.key !== key) hidden[prior.key] = new Date().toISOString();
    savedId = next.id;
    const customers = [...base.customers];
    if (index >= 0) customers[index] = next;
    else customers.push(next);
    return { prefs: base.prefs, customers, hidden };
  });
  return store.customers.find((customer) => customer.id === savedId) ?? null;
}

export async function deleteCustomer(id: string) {
  const removed = await updateJsonFile(FILE, EMPTY, (current) => {
    const customer = current.customers.find((item) => item.id === id);
    if (!customer) return current;
    return {
      prefs: current.prefs,
      customers: current.customers.filter((item) => item.id !== id),
      hidden: { ...(current.hidden ?? {}), [customer.key]: new Date().toISOString() },
    };
  });
  return removed.customers.every((customer) => customer.id !== id);
}

export async function getCustomerByToken(token: string) {
  if (!token || token.length < 20) return null;
  const store = await syncCustomers();
  return store.customers.find((customer) => customer.unsubscribeToken === token) ?? null;
}

export async function unsubscribeCustomer(token: string) {
  if (!token || token.length < 20) return null;
  const store = await updateJsonFile(FILE, EMPTY, (current) => {
    const match = Object.entries(current.prefs).find(
      ([, pref]) => pref.unsubscribeToken === token,
    );
    if (!match) return current;
    const [key, pref] = match;
    return {
      prefs: { ...current.prefs, [key]: { ...pref, marketing: false } },
      customers: current.customers.map((customer) =>
        customer.key === key ? { ...customer, marketing: false } : customer,
      ),
      hidden: current.hidden ?? {},
    };
  });
  return store.customers.find((customer) => customer.unsubscribeToken === token) ?? null;
}
