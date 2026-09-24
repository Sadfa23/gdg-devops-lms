import Link from "next/link";
import { GdgLogo } from "@/components/GdgLogo";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-9">
      <div className="w-full max-w-[380px]">
        <div className="mb-7 flex items-center gap-3">
          <GdgLogo width={30} height={18} />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">DevOps Track Access</span>
        </div>
        <h1 className="mb-2.5 text-[28px] font-extrabold tracking-[-0.02em] text-ink">Reset your password</h1>
        <p className="mb-7 text-[14px] text-muted">Enter the email on your account and we&apos;ll send a link to set a new password.</p>

        <ForgotPasswordForm />

        <Link href="/sign-in" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.1em] text-muted hover:text-ink">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
