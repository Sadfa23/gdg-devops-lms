import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { PipelineSection } from "@/features/landing/components/PipelineSection";
import { Button } from "@/components/ui/button";
import { listPublishedPosts } from "@/features/blog/data";

// Shows live post data — rendered per-request, not frozen at build time.
export const dynamic = "force-dynamic";

const VIZ_CARDS = [
  { n: "01", label: "TERRAFORM", color: "var(--g-blue)", title: "Terraform plan graph", blurb: "Point it at a directory of .tf files and it draws the infrastructure it's about to create.", file: "infra/main.tf", href: "/viz/terraform" },
  { n: "02", label: "ACTIONS", color: "var(--g-green)", title: "GitHub Actions workflow", blurb: "Paste a workflow file and see the job DAG needs: actually resolves into.", file: ".github/workflows/ci.yml", href: "/viz/actions" },
  { n: "03", label: "K8S", color: "var(--g-red)", title: "Kubernetes manifests", blurb: "See the Deployment → Service → Ingress chain a manifest actually produces.", file: "k8s/deployment.yaml", href: "/viz/k8s" },
];

export default async function LandingPage() {
  const posts = await listPublishedPosts(4);

  return (
    <div>
      <SiteHeader />

      <section className="relative flex min-h-[min(92vh,880px)] flex-col justify-end overflow-hidden border-b-2 border-line bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <Image src="/images/hero-image-lms.jpg" alt="" fill priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/50" />

        <div className="relative flex flex-1 flex-col justify-center px-6 py-20 md:px-12 md:py-24">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-0.5 w-8.5 bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">GDG On Campus JKUAT · DevOps Track</span>
          </div>
          <h1 className="max-w-[15ch] text-[clamp(44px,7vw,104px)] font-extrabold leading-[0.93] tracking-[-0.04em] text-white text-wrap-pretty">
            Ship like production depends on it.
          </h1>
          <p className="mt-7 max-w-[54ch] text-[19px] leading-[1.55] text-white/85">
            Twelve weeks of video lessons, graded labs and timed quizzes — built for students who would rather run the pipeline than
            read about it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/sign-in">
              <Button size="lg">Join the cohort →</Button>
            </Link>
            <Link href="/lessons">
              <Button variant="secondary" size="lg" className="border-white/55 text-white hover:bg-white/15">
                Watch lesson 01
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/22 px-6 py-5 md:px-12">
          <div className="flex items-center gap-3.5">
            <span className="flex gap-px">
              <span className="h-[5px] w-8 bg-g-blue" />
              <span className="h-[5px] w-8 bg-g-red" />
              <span className="h-[5px] w-8 bg-g-yellow" />
              <span className="h-[5px] w-8 bg-g-green" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">Learn · Build · Connect · Grow</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">Twelve weeks · Six modules · One cohort</span>
        </div>
      </section>

      <PipelineSection />

      <section id="tools" className="border-b-2 border-line">
        <div className="flex items-baseline justify-between gap-6 px-6 pb-6 pt-8 md:px-12">
          <h2 className="m-0 text-[clamp(28px,3.4vw,46px)] tracking-[-0.03em] text-ink">Read the code, see the architecture</h2>
          <span className="whitespace-nowrap font-mono text-[11px] tracking-[0.14em] text-muted">Built in the track</span>
        </div>
        <p className="max-w-[80ch] px-6 pb-5 text-[16px] text-muted md:px-12">
          Three visualizers, one input each: paste the code and get the diagram it describes — dependencies, job graphs and object links
          included.
        </p>
        <div className="grid grid-cols-1 gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {VIZ_CARDS.map((v) => (
            <Link key={v.n} href={v.href} className="flex flex-col bg-bg px-6 py-7 no-underline hover:bg-surface">
              <span className="mb-5.5 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">
                  {v.n} · {v.label}
                </span>
                <span className="h-1 w-6.5" style={{ background: v.color }} />
              </span>
              <span className="mb-2.5 text-[21px] font-extrabold tracking-[-0.02em] text-ink">{v.title}</span>
              <span className="mb-5 text-[14px] text-muted">{v.blurb}</span>
              <span className="flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="truncate font-mono text-[10px] tracking-[0.1em] text-muted">{v.file}</span>
                <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.12em] text-accent-ink">Open →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="blog" className="border-b-2 border-line">
        <div className="flex items-baseline justify-between gap-6 px-6 pb-6 pt-8 md:px-12">
          <h2 className="m-0 text-[clamp(28px,3.4vw,46px)] tracking-[-0.03em] text-ink">Written by the track</h2>
          <Link href="/blog" className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-accent-ink hover:underline">
            All posts →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="px-6 pb-10 text-[13px] text-muted md:px-12">Nothing published yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-px border-y border-line bg-line lg:grid-cols-2">
            <Link href={`/blog/${posts[0].slug}`} className="relative flex min-h-[360px] flex-col justify-end overflow-hidden bg-[#0c0c0c] no-underline">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="relative p-7">
                {posts[0].category && (
                  <p className="mb-3 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85">
                    <span className="h-0.5 w-6.5 bg-accent" />
                    {posts[0].category}
                  </p>
                )}
                <p className="max-w-[26ch] text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                  {posts[0].title}
                </p>
                <p className="mt-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70">
                  {posts[0].author.name} · {posts[0].readTimeMinutes ?? "—"} MIN READ
                </p>
              </div>
            </Link>
            <div className="grid grid-rows-3 gap-px bg-line">
              {posts.slice(1, 4).map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="flex flex-col justify-center gap-2 bg-bg px-6 py-5 no-underline hover:bg-surface">
                  <span className="flex items-center gap-2.5">
                    <span className="h-1 w-5.5 bg-g-blue" />
                    <span className="font-mono text-[10px] tracking-[0.12em] text-muted">{p.category}</span>
                  </span>
                  <span className="text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-ink">{p.title}</span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
                    {p.author.name} · {p.readTimeMinutes ?? "—"} MIN
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-b-2 border-line bg-accent px-6 py-16 text-white md:px-12">
        <p className="mb-5.5 font-mono text-[11px] uppercase tracking-[0.16em] opacity-85">GDG On Campus JKUAT · Core team 2026/2027</p>
        <h2 className="max-w-[22ch] text-[clamp(38px,6vw,84px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-white">
          Learn it, build it, then hand it to someone else.
        </h2>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/sign-in">
            <Button className="h-12 bg-white px-5.5 text-[#201e1d] hover:bg-white/90">Create your account</Button>
          </Link>
          <Link href="/lessons">
            <Button variant="secondary" className="h-12 border-white/60 px-5.5 text-white hover:bg-white/12">
              Tour the platform
            </Button>
          </Link>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.12em] text-muted md:px-12">
        <span>GDG On Campus JKUAT — DevOps Track</span>
        <span>Jomo Kenyatta University of Agriculture and Technology</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
