import { PageHeader } from "@/components/shell/PageHeader";
import { PostForm } from "@/features/blog/components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader crumb="Track lead · Editor" title="11 · Write a post" />
      <PostForm />
    </div>
  );
}
