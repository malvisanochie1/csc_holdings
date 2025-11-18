import type { UserCurrency, UserResource } from "@/lib/types/api";
import updateSnapshot from "../../../Notes/Data/update.json";
import settingsSnapshot from "../../../Notes/Data/settings.json";

type UpdateSnapshot = {
  data?: UserResource;
};

type SettingsSnapshot = {
  data?: {
    currencies?: UserCurrency[];
  };
};

const editableFields = [
  "username",
  "first_name",
  "last_name",
  "email",
  "phone",
  "country",
  "country_code",
  "address",
  "city",
  "state",
  "postal_code",
  "timezone",
  "occupation",
  "identity_number",
  "birth_date",
] as const;

type EditableField = (typeof editableFields)[number];

const fieldLabels: Record<EditableField, string> = {
  username: "Username",
  first_name: "First name",
  last_name: "Last name",
  email: "Email address",
  phone: "Phone number",
  country: "Country",
  country_code: "Country code",
  address: "Address",
  city: "City",
  state: "State or region",
  postal_code: "Postal code",
  timezone: "Timezone",
  occupation: "Occupation",
  identity_number: "Identity number",
  birth_date: "Date of birth",
};

const nullableEditableFields = [
  "username",
  "phone",
  "country",
  "country_code",
  "address",
  "city",
  "state",
  "postal_code",
  "timezone",
  "occupation",
  "identity_number",
  "birth_date",
] as const;

type NullableField = (typeof nullableEditableFields)[number];

const nullableFieldMap: Record<NullableField, true> = nullableEditableFields.reduce(
  (acc, field) => {
    acc[field] = true;
    return acc;
  },
  {} as Record<NullableField, true>
);

function isNullableField(field: EditableField): field is NullableField {
  return Boolean(nullableFieldMap[field as NullableField]);
}

const updateData = (updateSnapshot as UpdateSnapshot).data;

if (!updateData) {
  throw new Error("Failed to load default user profile snapshot");
}

const settingsData = (settingsSnapshot as SettingsSnapshot).data;
const currencyCatalog =
  settingsData?.currencies?.filter(
    (currency): currency is UserCurrency & { id: number } =>
      typeof currency.id === "number"
  ) ?? [];

type ProfileFieldUpdates = Partial<
  Pick<UserResource, EditableField | "avatar">
>;

export type ProfileUpdateInput = ProfileFieldUpdates & {
  currency_id?: number | string | null;
  language?: string | null;
};

export class ProfileUpdateError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "ProfileUpdateError";
    this.statusCode = statusCode;
  }
}

function cloneUser<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

const globalStore = globalThis as typeof globalThis & {
  __cscUserProfile?: UserResource;
};

if (!globalStore.__cscUserProfile) {
  globalStore.__cscUserProfile = cloneUser(updateData);
}

let currentUser = globalStore.__cscUserProfile;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }
  return value.trim();
}

function sanitizeProfileFields(
  input: ProfileUpdateInput
): ProfileFieldUpdates {
  const nextFields: ProfileFieldUpdates = {};

  editableFields.forEach((field) => {
    const rawValue = input[field as keyof ProfileUpdateInput];
    if (rawValue === undefined) {
      return;
    }

    if (rawValue === null) {
      if (isNullableField(field)) {
        nextFields[field] = null;
        return;
      }
      throw new ProfileUpdateError(
        `${fieldLabels[field] ?? field} is required`
      );
    }

    const value = normalizeString(rawValue);
    if (typeof value !== "string") {
      return;
    }

    if (!value.length) {
      if (isNullableField(field)) {
        nextFields[field] = null;
        return;
      }
      throw new ProfileUpdateError(
        `${fieldLabels[field] ?? field} is required`
      );
    }

    if (field === "email" && !EMAIL_REGEX.test(value)) {
      throw new ProfileUpdateError("Please provide a valid email address");
    }

    if (field === "birth_date" && Number.isNaN(Date.parse(value))) {
      throw new ProfileUpdateError("Invalid birth date supplied");
    }

    if (field === "country_code") {
      nextFields[field] = value.toUpperCase();
      return;
    }

    nextFields[field] = value;
  });

  if (typeof input.avatar === "string") {
    const avatar = input.avatar.trim();
    if (avatar.length > 0) {
      nextFields.avatar = avatar;
    }
  }

  return nextFields;
}

function coerceCurrencyId(currencyId: ProfileUpdateInput["currency_id"]) {
  if (
    currencyId === undefined ||
    currencyId === null ||
    currencyId === ""
  ) {
    return undefined;
  }

  const numericId =
    typeof currencyId === "string"
      ? Number.parseInt(currencyId, 10)
      : currencyId;

  if (!Number.isFinite(numericId)) {
    throw new ProfileUpdateError("Invalid currency identifier supplied");
  }

  return numericId;
}

function persistUser(user: UserResource) {
  currentUser = user;
  globalStore.__cscUserProfile = user;
}

export function getUserProfile() {
  return currentUser;
}

export function updateUserProfile(input: ProfileUpdateInput): UserResource {
  const nextUser: UserResource = {
    ...currentUser,
    ...sanitizeProfileFields(input),
  };

  const currencyId = coerceCurrencyId(input.currency_id);
  if (currencyId !== undefined) {
    const currency = currencyCatalog.find(
      (item) => item.id === currencyId
    );
    if (!currency) {
      throw new ProfileUpdateError(
        "The selected currency is no longer supported"
      );
    }
    nextUser.currency = cloneUser(currency);
  }

  if (typeof input.language === "string") {
    const language = input.language.trim();
    if (language.length) {
      nextUser.language_preference = language;
    }
  }

  persistUser(nextUser);
  return nextUser;
}
