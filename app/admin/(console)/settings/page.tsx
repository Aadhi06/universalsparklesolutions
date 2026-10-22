import { saveSettingsAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { getSettings } from "@/lib/store/settings";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        Settings
      </h1>
      <p className="mt-2 text-body">
        Contact details and homepage search titles. These update the public
        website when you save.
      </p>

      <form action={saveSettingsAction} className="mt-8 space-y-5 rounded-[6px] border border-line bg-white p-5 sm:p-6">
        <Field label="Email" name="email" type="email" defaultValue={settings.email} required />
        <Field label="Primary phone" name="phoneOne" defaultValue={settings.phoneOne} required />
        <Field label="Second phone" name="phoneTwo" defaultValue={settings.phoneTwo} />
        <Field
          label="WhatsApp number"
          name="whatsappNumber"
          defaultValue={settings.whatsappNumber}
          required
        />
        <Field
          label="Service area"
          name="serviceArea"
          defaultValue={settings.serviceArea}
          required
        />
        <Field
          label="Homepage title"
          name="homeTitle"
          defaultValue={settings.homeTitle}
          required
        />
        <div>
          <label htmlFor="homeDescription" className="mb-1.5 block text-sm font-medium text-navy">
            Homepage description <span className="text-blue">*</span>
          </label>
          <textarea
            id="homeDescription"
            name="homeDescription"
            required
            rows={4}
            defaultValue={settings.homeDescription}
            className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
          />
        </div>
        <Button type="submit">Save settings</Button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
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
        defaultValue={defaultValue}
        className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
      />
    </div>
  );
}
