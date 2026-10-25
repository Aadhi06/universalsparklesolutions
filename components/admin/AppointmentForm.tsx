import { deleteAppointmentAction, saveAppointmentAction } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { Button } from "@/components/ui/Button";
import {
  appointmentStatuses,
  melbourneToday,
  type Appointment,
} from "@/lib/store/appointments";
import { quoteServices } from "@/lib/site";

const fieldClass =
  "min-h-12 w-full rounded-[6px] border border-line bg-white px-3 text-base text-navy outline-none focus:border-blue";

export function AppointmentForm({
  appointment,
  defaults,
}: {
  appointment?: Appointment;
  defaults?: Partial<Appointment>;
}) {
  const value = appointment ?? defaults;
  const services = quoteServices.includes(value?.service as (typeof quoteServices)[number])
    ? [...quoteServices]
    : value?.service
      ? [value.service, ...quoteServices]
      : [...quoteServices];

  return (
    <form
      action={saveAppointmentAction}
      className="space-y-5 rounded-[6px] border border-line bg-white p-5 sm:p-6"
    >
      {appointment ? <input type="hidden" name="id" value={appointment.id} /> : null}
      {value?.enquiryId ? (
        <input type="hidden" name="enquiryId" value={value.enquiryId} />
      ) : null}
      <Field
        label="Customer name"
        name="customerName"
        required
        autoComplete="name"
        defaultValue={value?.customerName}
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        defaultValue={value?.phone}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={value?.email}
      />
      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-navy">
          Service <span className="text-blue">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          defaultValue={value?.service ?? ""}
          className={fieldClass}
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>
      <Field
        label="Suburb or postcode"
        name="location"
        required
        defaultValue={value?.location}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Date"
          name="date"
          type="date"
          required
          defaultValue={value?.date || melbourneToday()}
        />
        <Field
          label="Time"
          name="time"
          type="time"
          required
          defaultValue={value?.time || "09:00"}
        />
      </div>
      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-navy">
          Status <span className="text-blue">*</span>
        </label>
        <select
          id="status"
          name="status"
          required
          defaultValue={value?.status ?? "Scheduled"}
          className={fieldClass}
        >
          {appointmentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-navy">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={value?.notes}
          className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        {appointment ? "Save appointment" : "Add appointment"}
      </Button>
      {appointment ? (
        <div className="border-t border-line pt-5">
          <ConfirmSubmitButton
            formAction={deleteAppointmentAction}
            message="Delete this appointment? This cannot be undone."
          >
            Delete appointment
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
