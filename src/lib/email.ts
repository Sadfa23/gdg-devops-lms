import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "Reset your GDG DevOps LMS password",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #201e1d;">
        <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #dd2b0f; margin: 0 0 16px;">GDG DevOps LMS</p>
        <h1 style="font-size: 22px; margin: 0 0 12px;">Reset your password</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #605d5d;">
          Someone (hopefully you) asked to reset the password on this account. This link works once and expires in 30 minutes.
        </p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #dd2b0f; color: #ffffff; padding: 10px 20px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
            Reset password
          </a>
        </p>
        <p style="font-size: 12.5px; line-height: 1.6; color: #605d5d;">
          If you didn't request this, you can ignore this email — your password won't change.
        </p>
      </div>
    `,
    text: `Reset your GDG DevOps LMS password: ${resetUrl}\n\nThis link works once and expires in 30 minutes. If you didn't request this, ignore this email.`,
  });

  if (error) {
    throw new Error(`Failed to send reset email: ${error.message}`);
  }
}
