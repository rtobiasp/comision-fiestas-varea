import { notFound, redirect } from "next/navigation";
import TagForm from "@/components/admin/TagForm";
import { getTagById, updateTag } from "@/lib/api/tags";

export default async function EditarTag({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tag = await getTagById(id).catch(() => null);
  if (tag == null) {
    notFound();
  }

  async function updateTagAction(formData: FormData): Promise<void> {
    "use server";
    await updateTag(id, { nombre: String(formData.get("nombre") ?? "") });
    redirect("/admin/tags");
  }

  return (
    <TagForm
      mode="edit"
      initial={{ nombre: tag.nombre }}
      onSubmit={updateTagAction}
    />
  );
}
