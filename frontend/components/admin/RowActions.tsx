"use client";

import Link from "next/link";

type RowActionsProps = {
  editHref: string;
  viewHref?: string;
  item: { id: string; label: string };
  onSelectDelete: (item: { id: string; label: string }) => void;
};

export default function RowActions({
  editHref,
  viewHref,
  item,
  onSelectDelete,
}: RowActionsProps) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-1 text-[0.8rem] md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
      <Link
        href={editHref}
        className="text-primary underline-offset-4 hover:underline focus-visible:underline"
      >
        Editar
      </Link>
      {viewHref && (
        <>
          <span aria-hidden="true" className="text-muted-foreground">
            |
          </span>
          <Link
            href={viewHref}
            className="text-primary underline-offset-4 hover:underline focus-visible:underline"
          >
            Ver
          </Link>
        </>
      )}
      <span aria-hidden="true" className="text-muted-foreground">
        |
      </span>
      <button
        type="button"
        onClick={() => onSelectDelete(item)}
        className="cursor-pointer text-destructive underline-offset-4 hover:underline focus-visible:underline"
      >
        Papelera
      </button>
    </div>
  );
}
