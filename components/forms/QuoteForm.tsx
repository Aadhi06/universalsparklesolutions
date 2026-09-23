"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  quoteFrequencies,
  quoteServices,
  quoteSuccessMessage,
} from "@/lib/site";
import { trackQuoteSubmitted } from "@/lib/analytics";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type FormState = "idle" | "submitting" | "success" | "error";

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("company_website") || "").trim()) {
      setState("success");
      return;
    }

    const nextErrors: Record<string, string> = {};
    if (!String(data.get("fullName") || "").trim()) {
      nextErrors.fullName = "Enter your full name.";
    }
    if (!String(data.get("email") || "").trim()) {
      nextErrors.email = "Enter your email address.";
    }
    if (!String(data.get("phone") || "").trim()) {
      nextErrors.phone = "Enter a phone number.";
    }
    if (!String(data.get("service") || "").trim()) {
      nextErrors.service = "Select the service you need.";
    }
    if (!String(data.get("location") || "").trim()) {
      nextErrors.location = "Enter a suburb or postcode.";
    }
    if (!String(data.get("message") || "").trim()) {
      nextErrors.message = "Tell us about your requirements.";
    }

    const files = data.getAll("photos").filter((file): file is File => {
      return file instanceof File && file.size > 0;
    });

    if (files.length > MAX_FILES) {
      nextErrors.photos = `You can attach up to ${MAX_FILES} photos.`;
    }

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        nextErrors.photos = "Photos must be JPEG, PNG or WebP.";
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        nextErrors.photos = "Each photo must be 5 MB or smaller.";
        break;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setState("submitting");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "We could not send your enquiry.");
      }

      trackQuoteSubmitted();
      setState("success");
      form.reset();
    } catch (submitError) {
      setState("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your enquiry. Please try again or call us.",
      );
    }
  }

  if (state === "success") {
    return (
      <div
        className="rounded-[6px] border border-line bg-white p-6 sm:p-8"
        role="status"
      >
        <p className="font-display text-xl font-semibold text-navy">
          Enquiry received
        </p>
        <p className="mt-3 leading-relaxed text-body">{quoteSuccessMessage}</p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={() => setState("idle")}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-[6px] border border-line bg-white p-5 shadow-soft sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          name="fullName"
          required
          autoComplete="name"
          error={fieldErrors.fullName}
        />
        <Field
          label="Company or organisation"
          name="company"
          autoComplete="organization"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={fieldErrors.email}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          error={fieldErrors.phone}
        />
        <SelectField
          label="Service required"
          name="service"
          required
          error={fieldErrors.service}
          options={quoteServices}
        />
        <Field
          label="Suburb or postcode"
          name="location"
          required
          autoComplete="address-level2"
          error={fieldErrors.location}
        />
        <SelectField
          label="Cleaning frequency"
          name="frequency"
          options={quoteFrequencies}
          optional
        />
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
            Message <span className="text-blue">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
          />
          {fieldErrors.message ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldErrors.message}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="photos" className="mb-1.5 block text-sm font-medium text-navy">
            Photos <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="block w-full text-sm text-body file:mr-3 file:rounded-[6px] file:border-0 file:bg-surface file:px-3 file:py-2 file:font-medium file:text-navy"
          />
          <p className="mt-1.5 text-sm text-muted">
            Up to 3 images. JPEG, PNG or WebP. 5 MB each.
          </p>
          {fieldErrors.photos ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldErrors.photos}
            </p>
          ) : null}
        </div>
      </div>

      <input
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full sm:w-auto" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending…" : "Request My Quote"}
      </Button>
      <p className="mt-3 text-sm text-muted">
        This is a quote request, not a confirmed booking.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label}{" "}
        {required ? <span className="text-blue">*</span> : (
          <span className="font-normal text-muted">(optional)</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
      />
      {error ? (
        <p className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
  optional,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  optional?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label}{" "}
        {required ? <span className="text-blue">*</span> : null}
        {optional ? <span className="font-normal text-muted">(optional)</span> : null}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        className="min-h-12 w-full rounded-[6px] border border-line bg-white px-3 text-base text-navy outline-none focus:border-blue"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
