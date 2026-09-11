import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/features/blog/data";
import { PostBody } from "@/features/blog/components/PostBody";
import { headingsOf } from "@/features/blog/markdown-elements";
import { ArticleToc } from "@/features/blog/components/ArticleToc";
import { cloudinaryImageUrl } from "@/lib/cloudinary";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "live") notFound();

  const headings = headingsOf(post.content);

  return (
    <article>
      <div className="relative flex min-h-[320px] flex-col justify-end overflow-hidden bg-[#0c0c0c] px-6 py-10 md:px-12">
        {post.bannerPublicId && (
          // eslint-disable-next-line @next/next/no-img-element -- Cloudinary-hosted banner
          <img src={cloudinaryImageUrl(env.CLOUDINARY_CLOUD_NAME, post.bannerPublicId)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative max-w-[70ch]">
          {post.kicker && <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">{post.kicker}</p>}
          <h1 className="mb-3 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">{post.title}</h1>
          {post.deck && <p className="max-w-[60ch] text-[17px] leading-[1.5] text-white/85">{post.deck}</p>}
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70">
            {post.author.name} · {post.readTimeMinutes ? `${post.readTimeMinutes} MIN READ` : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1100px] gap-12 px-6 py-12 md:px-12">
        <PostBody content={post.content} />
        <ArticleToc headings={headings} />
      </div>

      <div className="border-t border-line px-6 py-8 md:px-12">
        <Link href="/blog" className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-ink hover:underline">
          ← All posts
        </Link>
      </div>
    </article>
  );
}
