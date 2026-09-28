"use client";

import { useState } from "react";
import Tiptap from "@/components/ui/tiptap/Tiptap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoriaDto, TagDto } from "@/types";

export default function NoticiaForm({
  categorias,
  tags,
  onCreate,
}: {
  categorias: CategoriaDto[];
  tags: TagDto[];
  onCreate: (formData: FormData) => Promise<void>;
}) {
  const [contenido, setContenido] = useState("");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">Añadir noticia</h1>
      <form
        id="noticia-form"
        action={onCreate}
        className="grid items-start gap-4 lg:grid-cols-[1fr_300px]"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="titulo" className="sr-only">
              Título *
            </Label>
            <Input
              type="text"
              id="titulo"
              name="titulo"
              required
              maxLength={200}
              placeholder="Añade un título"
              className="h-12 text-xl font-medium"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subtitulo" className="sr-only">
              Subtítulo
            </Label>
            <Input
              type="text"
              id="subtitulo"
              name="subtitulo"
              maxLength={300}
              placeholder="Subtítulo opcional"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contenido">Contenido *</Label>
            <Tiptap content={contenido} onChange={setContenido} />
            <Input type="hidden" name="contenido" value={contenido} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Publicar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="fijada" name="fijada" />
                <Label htmlFor="fijada" className="cursor-pointer">
                  Fijada
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  form="noticia-form"
                  name="accion"
                  value="guardar"
                >
                  Guardar
                </Button>
                <Button
                  type="submit"
                  form="noticia-form"
                  name="accion"
                  value="borrador"
                  variant="outline"
                >
                  Guardar como borrador
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              {categorias.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay categorías disponibles.
                </p>
              ) : (
                <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
                  {categorias.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`categoria-${c.id}`}
                        name="categoriaIds"
                        value={c.id}
                      />
                      <Label
                        htmlFor={`categoria-${c.id}`}
                        className="cursor-pointer font-normal"
                      >
                        {c.nombre}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
            </CardHeader>
            <CardContent>
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay tags disponibles.
                </p>
              ) : (
                <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
                  {tags.map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`tag-${t.id}`}
                        name="tagIds"
                        value={t.id}
                      />
                      <Label
                        htmlFor={`tag-${t.id}`}
                        className="cursor-pointer font-normal"
                      >
                        {t.nombre}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
