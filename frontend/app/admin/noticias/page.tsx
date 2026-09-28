import { Suspense } from "react";
import NoticiasTable from "@/components/admin/NoticiasTable";
import TablePagination from "@/components/admin/TablePagination";
import { buttonVariants } from "@/components/ui/button";
import { getNoticias, deleteNoticia } from "@/lib/api/noticias";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Noticias({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;

  const p = Math.max(1, Number(page)) || 1;
  const l = [10, 25, 50, 100].includes(Number(limit)) ? Number(limit) : 25;
  const offset = (p - 1) * l;

  const noticias = await getNoticias(offset, l);

  async function deleteNoticiaAction(id: string): Promise<void> {
    "use server";
    await deleteNoticia(id);
    revalidatePath("/admin/noticias");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Noticias</h1>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/admin/noticias/nueva`}
        >
          Añadir noticia
        </Link>
      </div>
      <NoticiasTable noticias={noticias} onDelete={deleteNoticiaAction} />
      <Suspense>
        <TablePagination page={p} limit={l} hasNext={noticias.length === l} />
      </Suspense>
    </div>
  );
}
