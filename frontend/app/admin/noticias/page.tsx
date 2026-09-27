import NoticiasTable from "@/components/admin/NoticiasTable";
import { getNoticias, deleteNoticia } from "@/lib/api/noticias";
import { revalidatePath } from "next/cache";

export default async function Noticias() {
  const noticias = await getNoticias();

  return <NoticiasTable noticias={noticias} />;
}
