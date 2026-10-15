/** Result state returned by the save-post Server Action (used by useActionState). */
export type SaveState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

/** Result state returned by the change-password Server Action. */
export type PasswordState = { error?: string; success?: boolean };

/** Result of an image upload Server Action. */
export type UploadResult = { url?: string; error?: string };
