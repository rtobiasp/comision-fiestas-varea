export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-varea-text-main">
        Buscar
      </h1>
      {query ? (
        <p className="mt-4 text-varea-text-muted">
          Resultados para “{query}”: la búsqueda estará disponible
          próximamente.
        </p>
      ) : (
        <p className="mt-4 text-varea-text-muted">
          Escribe un término en el buscador del menú para empezar.
        </p>
      )}
    </div>
  );
}
