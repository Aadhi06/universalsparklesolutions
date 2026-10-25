import { deleteEnquiryAction, saveEnquiryAction } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { Button } from "@/components/ui/Button";
import { enquiryStatuses, type Enquiry } from "@/lib/store/enquiries";
import { quoteFrequencies, quoteServices } from "@/lib/site";

const fieldClass =
  "min-h-12 w-full rounded-[6px] border border-line bg-white px-3 text-base text-navy outline-none focus:border-blue";

export function EnquiryForm({
  enquiry,
  defaults,
}: {
  enquiry?: Enquiry;
  defaults?: Partial<Pick<Enquiry, "fullName" | "company" | "email" | "phone" | "service" | "location" | "frequency" | "message" | "status">>;
}) {
  const value = enquiry ?? defaults;
  const services = quoteServices.includes(
    value?.service as (typeof quoteServices)[number],
  )
    ? [...quoteServices]
    : value?.service
      ? [value.service, ...quoteServices]
      : [...quoteServices];

  return (
    <form action={saveEnquiryAction} className="space-y-5 rounded-[6px] border border-line bg-white p-5 sm:p-6">
      {enquiry ? <input type="hidden" name="id" value={enquiry.id} /> : null}
      <Field label="Full name" name="fullName" required defaultValue={value?.fullName} />
      <Field label="Company" name="company" defaultValue={value?.company} />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        defaultValue={value?.email}
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        defaultValue={value?.phone}
      />
      <Select
        label="Service"
        name="service"
        required
        defaultValue={value?.service}
        options={services}
      />
      <Field
        label="Suburb or postcode"
        name="location"
        required
        defaultValue={value?.location}
      />
      <Select
        label="Frequency"
        name="frequency"
        defaultValue={value?.frequency}
        options={["", ...quoteFrequencies]}
        labels={["Not set", ...quoteFrequencies]}
      />
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
          Message <span className="text-blue">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={value?.message}
          className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
        />
      </div>
      <Select
        label="Status"
        name="status"
        required
        defaultValue={enquiry?.status ?? value?.status ?? "New"}
        options={[...enquiryStatuses]}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="w-full sm:w-auto">
          {enquiry ? "Save enquiry" : "Add enquiry"}
        </Button>
      </div>
      {enquiry ? (
        <div className="border-t border-line pt-5">
          <ConfirmSubmitButton
            formAction={deleteEnquiryAction}
            message="Delete this enquiry? This cannot be undone."
          >
            Delete enquiry
          </ConfirmSubmitButton>
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required ? <span className="text-blue">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className={fieldClass}
      />
    </div>
  );
}

function Select({
  label,
  name,
  defaultValue,
  required,
  options,
  labels,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  options: readonly string[];
  labels?: readonly string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required ? <span className="text-blue">*</span> : null}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={fieldClass}
      >
        {options.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>
            {labels?.[index] ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}
