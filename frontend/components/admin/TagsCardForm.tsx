"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { TagDto } from "@/types";
import { CreateTagDialog } from "./CreateTagDialog";
import { cn } from "cn";

type TagsCardFormProps = {
  tags: TagDto[];
  initialSelectedTagIds?: string[];
  onCreateTag: (formData: FormData) => TagDto | Promise<TagDto>;
  disabled?: boolean;
};

export default function TagsCardForm({
  tags,
  initialSelectedTagIds = [],
  onCreateTag,
  disabled = false,
}: TagsCardFormProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedTagIds,
  );

  function toggleTag(id: string) {
    if (disabled) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  function removeTag(id: string) {
    if (disabled) return;
    setSelectedIds((prev) => prev.filter((t) => t !== id));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Etiquetas</CardTitle>
        <CreateTagDialog onCreateTag={onCreateTag} disabled={disabled} />
      </CardHeader>
      <CardContent>
        {selectedIds.map((id) => (
          <input key={id} type="hidden" name="tagIds" value={id} />
        ))}
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay tags disponibles.
          </p>
        ) : (
          // Los `hidden tagIds` se siguen enviando; solo se bloquea
          // la interacción con los badges.
          <div
            className={`flex flex-row flex-wrap gap-2 ${disabled ? "opacity-60" : ""}`}
            inert={disabled}
            aria-disabled={disabled}
          >
            {tags.map((t) => {
              const selected = selectedIds.includes(t.id);
              return (
                <Badge
                  key={t.id}
                  variant={selected ? "default" : "outline"}
                  className={cn(
                    "h-7 rounded-md px-2 py-1 text-sm font-normal",
                    !selected && !disabled && "cursor-pointer",
                  )}
                  onClick={
                    selected || disabled ? undefined : () => toggleTag(t.id)
                  }
                >
                  {t.nombre}
                  {selected && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Quitar ${t.nombre}`}
                      className="ml-1 h-4 w-4 rounded-full"
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(t.id);
                      }}
                    >
                      <XIcon />
                    </Button>
                  )}
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
