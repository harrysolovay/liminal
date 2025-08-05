declare const EMAIL_REGEX: RegExp

// ---cut---
const validateEmail = (email: string): string | undefined => {
  // If valid, return undefined.
  if (EMAIL_REGEX.test(email)) return

  // If invalid, return the error message.
  return "Invalid email format."
}
