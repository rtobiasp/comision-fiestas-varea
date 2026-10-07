"use client";

import { CreateNombreDialog } from "./CreateNombreDialog";
import { TagDto } from "@/types";

type CreateTagDialogProps = {
  onCreateTag: (formData: FormData) => TagDto | Promise<TagDto>;
  disabled?: boolean;
};

export function CreateTagDialog({
  onCreateTag,
  disabled = false,
}: CreateTagDialogProps) {
  return (
    <CreateNombreDialog
      title="Nueva etiqueta"
      onCreate={onCreateTag}
      disabled={disabled}
    />
  );
}
