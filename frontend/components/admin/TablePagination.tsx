"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TablePaginationProps = {
  page: number;
  limit: number;
  hasNext: boolean;
};

export default function TablePagination({
  page,
  limit,
  hasNext,
}: TablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (np: number, nl = limit) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(Math.max(1, np)));
    params.set("limit", String(nl));
    return `${pathname}?${params.toString()}`;
  };

  const go = (np: number, nl = limit) => {
    if (np < 1) return;
    router.push(buildHref(np, nl));
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = !hasNext;

  return (
    <div className="flex items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Filas por página</FieldLabel>
        <Select
          value={String(limit)}
          onValueChange={(v) => {
            go(1, Number(v));
          }}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={buildHref(page - 1)}
              text="Anterior"
              aria-label="Ir a la página anterior"
              aria-disabled={isPrevDisabled}
              tabIndex={isPrevDisabled ? -1 : undefined}
              className={
                isPrevDisabled
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(e) => {
                if (isPrevDisabled) e.preventDefault();
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={buildHref(page + 1)}
              text="Siguiente"
              aria-label="Ir a la página siguiente"
              aria-disabled={isNextDisabled}
              tabIndex={isNextDisabled ? -1 : undefined}
              className={
                isNextDisabled
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(e) => {
                if (isNextDisabled) e.preventDefault();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Página {page}
      </p>
    </div>
  );
}
