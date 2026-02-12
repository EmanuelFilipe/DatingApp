import { RegisterCreds } from "../../../types/register-creds";

export function ValidateRequiredFields(creds: RegisterCreds): string | null {
    if (!creds.email || !creds.displayName || !creds.password)
      return 'All fields are required!'

    return null
}