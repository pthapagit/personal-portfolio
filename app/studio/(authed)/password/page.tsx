import { ChangePasswordForm } from "@/components/blog/ChangePasswordForm";
import { changePasswordAction } from "@/app/studio/actions";

export default function ChangePasswordPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold uppercase tracking-[0.15em]">
        Change password
      </h1>
      <p className="mb-6 text-sm text-ink-soft">
        Updates your Studio login. Your new password goes straight to Supabase and is never stored
        in this site&apos;s code or settings.
      </p>
      <ChangePasswordForm action={changePasswordAction} />
    </div>
  );
}
