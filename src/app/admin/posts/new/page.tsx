import { PostForm } from "@/components/admin/PostForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader title="New Post" />
      <PostForm />
    </div>
  );
}
