import { notFound } from "next/navigation";
import { getPostForEdit } from "@/features/blog/data";
import { setPostStatus } from "@/features/blog/actions";
import { PageHeader } from "@/components/shell/PageHeader";
import { Button } from "@/components/ui/button";
import { PostMetaForm } from "@/features/blog/components/PostMetaForm";
import { MarkdownEditor } from "@/features/blog/components/MarkdownEditor";
import { DeletePostButton } from "@/features/blog/components/DeletePostButton";
import { env } from "@/lib/env";

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]/edit">) {
  const { id } = await params;
  const post = await getPostForEdit(id);
  if (!post) notFound();

  return (
    <div>
      <PageHeader
        crumb="Track lead · Editor"
        title={post.title}
        actions={
          <div className="flex items-center gap-2">
            <form action={setPostStatus.bind(null, post.id, post.status === "live" ? "draft" : "live")}>
              <Button type="submit" variant={post.status === "live" ? "secondary" : "primary"}>
                {post.status === "live" ? "Unpublish" : "Publish"}
              </Button>
            </form>
            <DeletePostButton postId={post.id} title={post.title} />
          </div>
        }
      />

      <div className="mx-auto max-w-[1100px]">
        <div className="max-w-[720px]">
          <PostMetaForm post={post} cloudName={env.CLOUDINARY_CLOUD_NAME} apiKey={env.CLOUDINARY_API_KEY} />
        </div>
        <MarkdownEditor
          postId={post.id}
          initialContent={post.content}
          cloudName={env.CLOUDINARY_CLOUD_NAME}
          apiKey={env.CLOUDINARY_API_KEY}
          bunnyLibraryId={env.BUNNY_STREAM_LIBRARY_ID}
        />
      </div>
    </div>
  );
}
