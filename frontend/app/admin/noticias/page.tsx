"use client";

import { useState } from "react";
import Tiptap from "@/components/ui/Tiptap";

export default function Noticias() {
  // `contenido` es el HTML que se enviará al backend en `Create/UpdateNoticiaCommand.contenido`.
  const [contenido, setContenido] = useState("");
  const [verHtml, setVerHtml] = useState(false);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Noticias</h1>
      <Tiptap content={contenido} onChange={setContenido} />
      <div>
        <button
          type="button"
          onClick={() => setVerHtml((v) => !v)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
        >
          {verHtml ? "Ocultar HTML" : "Ver HTML generado"}
        </button>
        {verHtml && (
          <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-neutral-900 p-3 text-xs text-neutral-100">
            {contenido || "(vacío)"}
          </pre>
        )}
      </div>
    </div>
  );
}
