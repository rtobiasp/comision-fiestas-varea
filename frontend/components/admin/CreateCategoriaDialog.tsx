"use client";

import { CreateNombreDialog } from "./CreateNombreDialog";
import { CategoriaDto } from "@/types";

type CreateCategoriaDialogProps = {
  onCreateCategoria: (
    formData: FormData,
  ) => CategoriaDto | Promise<CategoriaDto>;
  disabled?: boolean;
};

export function CreateCategoriaDialog({
  onCreateCategoria,
  disabled = false,
}: CreateCategoriaDialogProps) {
  return (
    <CreateNombreDialog
      title="Nueva categoría"
      onCreate={onCreateCategoria}
      disabled={disabled}
    />
  );
}
