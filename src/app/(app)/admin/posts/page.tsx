import Link from "next/link";
import { listAllPostsForAdmin } from "@/features/blog/data";
import { PageHeader } from "@/components/shell/PageHeader";
import { Button } from "@/components/ui/button";
import { DeletePostButton } from "@/features/blog/components/DeletePostButton";

export default async function AdminPostsIndexPage() {
  const posts = await listAllPostsForAdmin();

  return (
    <div>
      <PageHeader
        crumb="Track lead · Content"
        title="Posts"
        actions={
          <Link href="/admin/posts/new">
            <Button size="sm">+ New post</Button>
          </Link>
        }
      />

      {posts.length === 0 ? (
        <p className="text-[13px] text-muted">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-px bg-line">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 bg-surface px-4 py-3">
              <Link href={`/admin/posts/${post.id}/edit`} className="flex min-w-0 flex-1 items-center gap-4 no-underline hover:opacity-80">
                <span
                  className={
                    post.status === "live"
                      ? "font-mono text-[10px] uppercase tracking-[0.1em] text-accent-ink"
                      : "font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                  }
                >
                  {post.status}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14.5px] text-ink">{post.title}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{post.category ?? "—"}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted">{post.author.name}</span>
              </Link>
              <DeletePostButton postId={post.id} title={post.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
