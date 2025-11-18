"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useUpdateProfile } from "@/lib/api/auth";
import { useToast } from "@/components/providers/toast-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserResource } from "@/lib/types/api";

type ProfileFormState = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
};

const fieldOrder: Array<keyof ProfileFormState> = [
  "username",
  "first_name",
  "last_name",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "postal_code",
  "country",
];

const EMPTY_STATE: ProfileFormState = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
};

function buildFormState(user?: UserResource | null): ProfileFormState {
  if (!user) {
    return { ...EMPTY_STATE };
  }

  return {
    username: user.username ?? "",
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    country: user.country ?? "",
    address: user.address ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    postal_code: user.postal_code ?? "",
  };
}

const inputMeta: Record<
  keyof ProfileFormState,
  { label: string; placeholder?: string; type?: React.HTMLInputTypeAttribute }
> = {
  username: { label: "Username", placeholder: "john.client" },
  first_name: { label: "First name", placeholder: "John" },
  last_name: { label: "Last name", placeholder: "Doe" },
  email: {
    label: "Email address",
    placeholder: "john@example.com",
    type: "email",
  },
  phone: { label: "Phone number", placeholder: "+1 202 555 0123", type: "tel" },
  address: { label: "Street address", placeholder: "21 Adeola Odeku St" },
  city: { label: "City", placeholder: "London" },
  state: { label: "State/Region", placeholder: "Greater London" },
  postal_code: { label: "Postal code", placeholder: "SE1 9PX" },
  country: { label: "Country", placeholder: "United Kingdom" },
};

const personalFields: Array<keyof ProfileFormState> = [
  "username",
  "first_name",
  "last_name",
  "email",
  "phone",
];

const contactFields: Array<keyof ProfileFormState> = [
  "address",
  "city",
  "state",
  "postal_code",
  "country",
];

const EditAccount = () => {
  const { user } = useAuthStore();
  const baseline = React.useMemo(() => buildFormState(user), [user]);
  const [formValues, setFormValues] = React.useState<ProfileFormState>(baseline);
  const { showToast } = useToast();
  const { mutateAsync: submitProfile, isPending } = useUpdateProfile();

  React.useEffect(() => {
    setFormValues(baseline);
  }, [baseline]);

  const isDirty = React.useMemo(() => {
    return fieldOrder.some(
      (key) => baseline[key] !== formValues[key]
    );
  }, [baseline, formValues]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const field = name as keyof ProfileFormState;
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleReset = React.useCallback(() => {
    setFormValues(baseline);
  }, [baseline]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isDirty || isPending) return;

      try {
        await submitProfile(formValues);
        showToast({
          type: "success",
          title: "Profile updated",
          description: "Your recovery profile has been refreshed.",
        });
      } catch (error) {
        const message =
          (error as Error)?.message || "Unable to update profile";
        showToast({
          type: "error",
          title: "Update failed",
          description: message,
        });
      }
    },
    [formValues, isDirty, isPending, showToast, submitProfile]
  );

  return (
    <Card className="w-full border-slate-200/80 shadow-lg shadow-slate-900/5 dark:border-slate-800/80">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
          Edit Account
        </CardTitle>
        <CardDescription>
          Keep your recovery contact details up to date so we can validate
          activity and reach you when recovery milestones change.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <form className="space-y-10" onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend className="text-base font-semibold text-gray-900 dark:text-white">
              Personal Information
            </FieldLegend>
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                {personalFields.map((key) => {
                  const isEmailField = key === "email";
                  return (
                    <Field key={key}>
                      <FieldLabel htmlFor={key}>
                        {inputMeta[key].label}
                      </FieldLabel>
                      <Input
                        id={key}
                        name={key}
                        type={inputMeta[key].type ?? "text"}
                        autoComplete={isEmailField ? "email" : "off"}
                        disabled={isPending || isEmailField}
                        readOnly={isEmailField}
                        aria-readonly={isEmailField}
                        placeholder={inputMeta[key].placeholder}
                        value={formValues[key]}
                        onChange={handleChange}
                      />
                    </Field>
                  );
                })}
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend className="text-base font-semibold text-gray-900 dark:text-white">
              Contact Details
            </FieldLegend>
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                {contactFields.map((key) => (
                  <Field key={key}>
                    <FieldLabel htmlFor={key}>
                      {inputMeta[key].label}
                    </FieldLabel>
                    <Input
                      id={key}
                      name={key}
                      type={inputMeta[key].type ?? "text"}
                      autoComplete="off"
                      disabled={isPending}
                      placeholder={inputMeta[key].placeholder}
                      value={formValues[key]}
                      onChange={handleChange}
                    />
                  </Field>
                ))}
              </div>
            </FieldGroup>
          </FieldSet>

          <div className="flex flex-col gap-3 border-t border-dashed border-slate-200 pt-6 text-sm text-muted-foreground dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Need to upload new KYC files? Visit the{" "}
              <span className="font-semibold text-foreground">
                Verification
              </span>{" "}
              tab after saving your profile updates.
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                disabled={!isDirty || isPending}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!isDirty || isPending}
                className="min-w-[140px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditAccount;
