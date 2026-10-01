import CreateMediaForm from "@/components/admin/CreateMediaForm";
import MediaCard from "@/components/admin/MediaCard";
import { deleteMedia, getAllMedias, uploadMedia } from "@/lib/api/media";
import { UploadMediaData } from "@/types";
import { revalidatePath } from "next/cache";

async function deleteMediaAction(id: string) {
  "use server";
  await deleteMedia(id);
  revalidatePath("/admin/media");
}

async function uploadMediaAction(formData: FormData) {
  "use server";
  const entry = formData.get("file");
  if (!(entry instanceof File) || entry.size === 0)
    throw new Error("Selecciona un archivo");

  const rawAlt = formData.get("altText");
  const altText =
    typeof rawAlt === "string" && rawAlt.trim() !== "" ? rawAlt : undefined;

  const created = await uploadMedia({ file: entry, altText });
  revalidatePath("/admin/media");
  return created;
}

export default async function Media() {
  const media = await getAllMedias();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {media.length} archivos en la biblioteca
        </p>
        <CreateMediaForm onSubmit={uploadMediaAction} />
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
        {media.map((m) => (
          <MediaCard key={m.id} media={m} onDelete={deleteMediaAction} />
        ))}
      </div>
    </div>
  );
}
