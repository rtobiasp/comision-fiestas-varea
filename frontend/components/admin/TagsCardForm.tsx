"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TagDto } from "@/types";
import { CreateTagDialog } from "./CreateTagDialog";

type TagsCardFormProps = {
  tags: TagDto[];
  initialSelectedTagIds?: string[];
  onCreateTag: (formData: FormData) => TagDto | Promise<TagDto>;
  disabled?: boolean;
  loadError?: boolean;
  onRetry?: () => void;
  retrying?: boolean;
  fieldErrors?: string[];
};

export default function TagsCardForm({
  tags,
  initialSelectedTagIds = [],
  onCreateTag,
  disabled = false,
  loadError = false,
  onRetry,
  retrying = false,
  fieldErrors = [],
}: TagsCardFormProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedTagIds,
  );
  const knownIds = new Set(tags.map((t) => t.id));
  const missingIds = selectedIds.filter((id) => !knownIds.has(id));

  function toggleTag(id: string, checked: boolean) {
    if (disabled) return;
    setSelectedIds((prev) =>
      checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((t) => t !== id),
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Etiquetas</CardTitle>
        <CreateTagDialog onCreateTag={onCreateTag} disabled={disabled} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {selectedIds.map((id) => (
          <input key={id} type="hidden" name="tagIds" value={id} />
        ))}
        {loadError && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>No se pudieron cargar las etiquetas</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>
                Puedes escribir y guardar igual; las etiquetas son opcionales.
              </p>
              {onRetry && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  disabled={disabled || retrying}
                  onClick={onRetry}
                >
                  {retrying ? "Reintentando…" : "Reintentar"}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
        {fieldErrors.length > 0 && (
          <div id="tags-error" role="alert">
            {fieldErrors.map((m, i) => (
              <p key={i} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
        )}
        {tags.length === 0 && missingIds.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay etiquetas disponibles.
          </p>
        ) : (
          <div
            className={`flex max-h-60 flex-col gap-2 overflow-y-auto ${disabled ? "opacity-60" : ""}`}
            inert={disabled}
            aria-disabled={disabled}
          >
            {tags.map((t) => {
              const checked = selectedIds.includes(t.id);
              return (
                <div key={t.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`tag-${t.id}`}
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={(v) => toggleTag(t.id, v === true)}
                  />
                  <Label
                    htmlFor={`tag-${t.id}`}
                    className="cursor-pointer font-normal"
                  >
                    {t.nombre}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
