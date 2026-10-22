"use client";

import { Button } from "@/components/ui/Button";

export function ConfirmSubmitButton({
  children,
  message,
  formAction,
}: {
  children: React.ReactNode;
  message: string;
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <Button
      type="submit"
      variant="secondary"
      formAction={formAction}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
