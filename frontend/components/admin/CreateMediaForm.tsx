"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { MediaDto } from "@/types";
import { toFormError } from "@/lib/api/form-error";

type CreateMediaFormProps = {
  onSubmit: (formData: FormData) => Promise<MediaDto>;
};

export default function CreateMediaForm({ onSubmit }: CreateMediaFormProps) {
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [, formAction, isPending] = useActionState(
    async (_prev: null, formData: FormData): Promise<null> => {
      setError(null);
      try {
        await onSubmit(formData);
        formRef.current?.reset();
      } catch (error) {
        setError(toFormError(error).message);
      }
      return null;
    },
    null,
  );

  if (!opened) {
    return (
      <Button disabled={opened} onClick={() => setOpened(true)}>
        + Añadir media
      </Button>
    );
  }

  return (
    <form ref={formRef} action={formAction}>
      <FieldGroup>
        <Field>
          <Label htmlFor="file">Archivo</Label>
          <Input
            id="file"
            type="file"
            name="file"
            required
            disabled={isPending}
            aria-invalid={error !== null}
            aria-describedby={error ? "media-error" : undefined}
            onChange={() => {
              if (error) setError(null);
            }}
          />
        </Field>
        <Field>
          <Label htmlFor="altText">Texto alternativo</Label>
          <Input
            id="altText"
            name="altText"
            placeholder="Texto alternativo"
            disabled={isPending}
            aria-invalid={error !== null}
            aria-describedby={error ? "media-error" : undefined}
            onChange={() => {
              if (error) setError(null);
            }}
          />
        </Field>
        {error && (
          <p id="media-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </FieldGroup>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setOpened(false);
          }}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Subiendo…" : "Subir"}
        </Button>
      </div>
    </form>
  );
}
