import NoticiasTable from "@/components/admin/NoticiasTable";
import { getNoticias, deleteNoticia } from "@/lib/api/noticias";
import { revalidatePath } from "next/cache";

export default async function Noticias() {
  const noticias = await getNoticias();

  async function deleteNoticiaAction(id: string): Promise<void> {
    "use server";
    await deleteNoticia(id);
    revalidatePath("/admin/noticias");
  }

  return <NoticiasTable noticias={noticias} onDelete={deleteNoticiaAction} />;
}
