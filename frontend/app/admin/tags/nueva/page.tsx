import { redirect } from "next/navigation";
import TagForm from "@/components/admin/TagForm";
import { createTag } from "@/lib/api/tags";

async function createTagAction(formData: FormData): Promise<void> {
  "use server";
  await createTag({ nombre: String(formData.get("nombre") ?? "") });
  redirect("/admin/tags");
}

export default function NuevoTag() {
  return <TagForm mode="create" onSubmit={createTagAction} />;
}
