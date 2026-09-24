import { GdgLogo } from "@/components/GdgLogo";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default async function ResetPasswordPage(props: PageProps<"/reset-password/[token]">) {
  const { token } = await props.params;

  return (
    <div className="flex min-h-screen items-center justify-center p-9">
      <div className="w-full max-w-[380px]">
        <div className="mb-7 flex items-center gap-3">
          <GdgLogo width={30} height={18} />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">DevOps Track Access</span>
        </div>
        <h1 className="mb-2.5 text-[28px] font-extrabold tracking-[-0.02em] text-ink">Set a new password</h1>
        <p className="mb-7 text-[14px] text-muted">This link works once. Pick a password you&apos;ll remember.</p>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
