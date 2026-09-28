import NoticiasTable from "@/components/admin/NoticiasTable";
import { buttonVariants } from "@/components/ui/button";
import { getNoticias, deleteNoticia } from "@/lib/api/noticias";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Noticias() {
  const noticias = await getNoticias();

  async function deleteNoticiaAction(id: string): Promise<void> {
    "use server";
    await deleteNoticia(id);
    revalidatePath("/admin/noticias");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row gap-4 items-center">
        <h1 className="text-3xl font-bold">Noticias</h1>
        <Link
          className={buttonVariants({ className: "w-fit" })}
          href={`/admin/noticias/nueva`}
        >
          Nueva noticia
        </Link>
      </div>
      <NoticiasTable noticias={noticias} onDelete={deleteNoticiaAction} />
    </div>
  );
}
