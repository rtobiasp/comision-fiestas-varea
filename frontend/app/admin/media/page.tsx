import MediaCard from "@/components/admin/MediaCard";
import { getAllMedias } from "@/lib/api/media";

export default async function Media() {
  const media = await getAllMedias();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {media.length} archivos en la biblioteca
        </p>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
        {media.map((m) => (
          <MediaCard key={m.id} media={m} />
        ))}
      </div>
    </div>
  );
}
