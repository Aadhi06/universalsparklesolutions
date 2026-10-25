import { deleteCustomerAction, saveCustomerAction } from "@/app/admin/customer-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { Button } from "@/components/ui/Button";
import { quoteServices } from "@/lib/site";
import type { Customer } from "@/lib/store/customers";

const fieldClass =
  "min-h-12 w-full rounded-[6px] border border-line bg-white px-3 text-base text-navy outline-none focus:border-blue";

export function CustomerForm({ customer }: { customer?: Customer }) {
  const currentService = customer?.services[0] ?? "";
  const services = quoteServices.includes(currentService as (typeof quoteServices)[number])
    ? [...quoteServices]
    : currentService
      ? [currentService, ...quoteServices]
      : [...quoteServices];

  return (
    <form action={saveCustomerAction} className="space-y-5 rounded-[6px] border border-line bg-white p-5 sm:p-6">
      {customer ? <input type="hidden" name="id" value={customer.id} /> : null}
      <Field label="Full name" name="fullName" required defaultValue={customer?.fullName} />
      <Field label="Company" name="company" defaultValue={customer?.company} />
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={customer?.email} />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" defaultValue={customer?.phone} />
      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-navy">
          Service
        </label>
        <select id="service" name="service" defaultValue={currentService} className={fieldClass}>
          <option value="">Not set</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>
      <Field label="Suburb or postcode" name="location" defaultValue={customer?.locations[0]} />
      <label className="flex min-h-12 items-center gap-3 text-sm font-semibold text-navy">
        <input
          type="checkbox"
          name="marketing"
          defaultChecked={customer ? customer.marketing : true}
          className="size-5 accent-blue"
        />
        Can receive offers
      </label>
      <Button type="submit" className="w-full sm:w-auto">
        {customer ? "Save customer" : "Add customer"}
      </Button>
      {customer ? (
        <div className="border-t border-line pt-5">
          <ConfirmSubmitButton
            formAction={deleteCustomerAction}
            message="Remove this customer from the list? Their enquiries stay in Enquiries."
          >
            Delete customer
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
