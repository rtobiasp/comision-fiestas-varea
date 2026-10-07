import TagsTable from "@/components/admin/TagsTable";
import { buttonVariants } from "@/components/ui/button";
import { deleteTag, getTags } from "@/lib/api/tags";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Tags() {
  const tags = await getTags();

  async function deleteTagAction(id: string): Promise<void> {
    "use server";
    await deleteTag(id);
    revalidatePath("/admin/tags");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Tags</h1>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/admin/tags/nueva`}
        >
          Añadir tag
        </Link>
      </div>
      <TagsTable tags={tags} onDelete={deleteTagAction} />
    </div>
  );
}
