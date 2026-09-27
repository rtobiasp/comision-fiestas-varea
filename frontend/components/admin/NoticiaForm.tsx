"use client";

import { useState } from "react";
import Tiptap from "@/components/ui/tiptap/Tiptap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Nueva noticia</CardTitle>
        <CardDescription>
          Completa los campos para crear una noticia.
        </CardDescription>
        <CardAction>
          <Button type="submit" form="noticia-form">
            Guardar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="noticia-form" action={onCreate} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              type="text"
              id="titulo"
              name="titulo"
              required
              maxLength={200}
              placeholder="Titular de la noticia"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subtitulo">Subtítulo</Label>
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

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="publicada" name="publicada" />
              <Label htmlFor="publicada" className="cursor-pointer">
                Publicada
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="fijada" name="fijada" />
              <Label htmlFor="fijada" className="cursor-pointer">
                Fijada
              </Label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Categorías</Label>
            {categorias.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay categorías disponibles.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {categorias.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 rounded-lg border border-input px-3 py-2"
                  >
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
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay tags disponibles.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {tags.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 rounded-lg border border-input px-3 py-2"
                  >
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
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="submit" form="noticia-form">
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
}
