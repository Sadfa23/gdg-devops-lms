import Link from "next/link";
import Image from "next/image";
import { GdgLogo } from "@/components/GdgLogo";
import { AuthForm } from "@/features/auth/components/AuthForm";

/** The design's split auth panel (README §2), extended with real
 * email+password fields — see AuthForm's own comment for why credentials
 * auth exists alongside OAuth. */
export default async function SignInPage(props: PageProps<"/sign-in">) {
  const searchParams = await props.searchParams;
  const justReset = searchParams.reset === "1";

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-between border-b-2 border-line p-9 md:border-b-0 md:border-r-2">
        <Link href="/" className="self-start font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-ink">
          ← Back to site
        </Link>

        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-7 flex items-center gap-3">
            <GdgLogo width={30} height={18} />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">DevOps Track Access</span>
          </div>
          <h1 className="mb-2.5 text-[40px] font-extrabold tracking-[-0.03em] text-ink">Welcome back.</h1>
          <p className="mb-7 text-muted">Sign in with the account your club membership is tied to.</p>

          <AuthForm justReset={justReset} />
        </div>

        <span aria-hidden />
      </div>

      <div className="hidden flex-col justify-center gap-10 bg-accent p-9 text-white md:flex">
        {/* The artwork carries its own GDG/JKUAT branding and color accents,
         * so the flat color-swatch bar that used to sit here was dropped —
         * redundant next to it rather than complementary. Cropped in on the
         * illustration itself (object-cover) rather than shown at its native
         * ratio — the source canvas has a wide margin of empty transparent
         * space around the actual artwork that otherwise reads as a gap. */}
        <div className="relative h-75 w-full overflow-hidden">
          <Image
            src="/1x/Artboard 1.webp"
            alt="Google Developer Group — JKUAT DevOps track illustration"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
        </div>

        <div>
          <blockquote className="max-w-[22ch] text-[clamp(24px,3vw,38px)] leading-[1.1] font-extrabold tracking-[-0.03em]">
            The cohort that ships together, learns twice as fast.
          </blockquote>
          <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] opacity-85">Terence Otieno · DevOps Co-Lead</div>
        </div>
      </div>
    </div>
  );
}
