import Link from "next/link";
import { listPublishedPosts } from "@/features/blog/data";
import { cloudinaryImageUrl } from "@/lib/cloudinary";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

const CATEGORY_COLOR: Record<string, string> = {
  guide: "var(--g-blue)",
  teardown: "var(--g-green)",
  career: "var(--accent)",
  notes: "var(--g-blue)",
  security: "var(--g-green)",
};

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-12 md:px-12">
      <h1 className="mb-8 text-[clamp(28px,3.4vw,46px)] font-extrabold tracking-[-0.03em] text-ink">Written by the track</h1>

      {posts.length === 0 && <p className="text-[13px] text-muted">No posts published yet.</p>}

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="relative mb-px flex min-h-[280px] flex-col justify-end overflow-hidden bg-[#0c0c0c] p-7 no-underline"
        >
          {featured.bannerPublicId && (
            // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-hosted
            <img src={cloudinaryImageUrl(env.CLOUDINARY_CLOUD_NAME, featured.bannerPublicId)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="relative">
            {featured.category && (
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85">{featured.category}</p>
            )}
            <p className="max-w-[26ch] text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
              {featured.title}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70">
              {featured.author.name} · {featured.readTimeMinutes ?? "—"} MIN READ
            </p>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="flex flex-col gap-2 bg-bg p-6 no-underline hover:bg-surface">
            <div className="flex items-center gap-2.5">
              <span className="h-1 w-5.5" style={{ background: post.category ? CATEGORY_COLOR[post.category] : "var(--muted)" }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{post.category}</span>
            </div>
            <p className="text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-ink">{post.title}</p>
            <p className="font-mono text-[10px] tracking-[0.1em] text-muted">
              {post.author.name} · {post.readTimeMinutes ?? "—"} MIN
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
