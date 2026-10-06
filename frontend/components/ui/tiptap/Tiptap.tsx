"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  TextQuote,
  SquareCode,
  Minus,
  Link2,
  Unlink,
  ImagePlus,
  Clapperboard,
  Table as TableIcon,
  Rows3,
  Columns3,
  Trash2,
  Eraser,
  Type,
  Heading2,
  Heading3,
  Heading4,
  CaseSensitive,
  Palette,
  Highlighter,
  ChevronDown,
} from "lucide-react";
import { Video } from "./tiptap-video";
import MediaSelector from "@/components/admin/media-selector/MediaSelector";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
import { MediaTipo } from "@/types";

export interface TiptapProps {
  content?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
}

const TEXT_COLORS = [
  { name: "Negro", value: "#111827" },
  { name: "Gris", value: "#6B7280" },
  { name: "Rojo", value: "#DC2626" },
  { name: "Naranja", value: "#EA580C" },
  { name: "Amarillo", value: "#CA8A04" },
  { name: "Verde", value: "#059669" },
  { name: "Azul", value: "#2563EB" },
  { name: "Morado", value: "#7C3AED" },
  { name: "Rosa", value: "#DB2777" },
];

const HIGHLIGHT_COLORS = [
  { name: "Amarillo", value: "#FEF08A" },
  { name: "Verde", value: "#BBF7D0" },
  { name: "Azul", value: "#BFDBFE" },
  { name: "Rosa", value: "#FECDD3" },
  { name: "Naranja", value: "#FED7AA" },
  { name: "Morado", value: "#E9D5FF" },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 30, 36];

const LINK_URL = /^(https?:\/\/.+|mailto:[^\s]+)$/i;

export default function Tiptap({
  content = "",
  onChange,
  editable = true,
  placeholder = "Escribe el contenido de la noticia…",
}: TiptapProps) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto"],
          shouldAutoLink: (url) => LINK_URL.test(url),
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      Subscript,
      Superscript,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { loading: "lazy" },
      }),
      Video,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "tiptap-editor", spellcheck: "true" },
    },
    onCreate: ({ editor }) => setCharCount(editor.getText().length),
    onUpdate: ({ editor }) => {
      setCharCount(editor.getText().length);
      onChangeRef.current?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.isEditable !== editable) editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || content === undefined) return;
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => () => editor?.destroy(), [editor]);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white text-neutral-900 shadow-sm">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-end border-t border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs text-neutral-500">
        {charCount} caracteres
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const [dialog, setDialog] = useState<{
    mode: "link";
    url: string;
    error: string;
  } | null>(null);
  const [picker, setPicker] = useState<{
    mode: "image" | "video";
    currentSrc: string | null;
  } | null>(null);

  function openPicker(mode: "image" | "video") {
    if (!editor) return;
    const attrs =
      mode === "image"
        ? (editor.getAttributes("image") as { src?: string })
        : (editor.getAttributes("video") as { src?: string });
    setPicker({ mode, currentSrc: attrs.src ?? null });
  }

  const disabled = !editor || !editor.isEditable;

  function openDialog(mode: "link") {
    if (!editor) return;
    const attrs = editor.getAttributes("link") as { href?: string };
    setDialog({ mode, url: attrs.href ?? "", error: "" });
  }

  function applyDialog() {
    if (!editor || !dialog) return;
    const url = dialog.url.trim();
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setDialog(null);
      return;
    }
    if (!LINK_URL.test(url)) {
      setDialog({
        ...dialog,
        error: "Usa una URL http(s) o un correo mailto:.",
      });
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
    setDialog(null);
  }

  function insertFromLibrary(media: { url: string; altText: string | null }) {
    if (!editor || !picker) return;
    const src = getMediaAbsoluteUrl(media.url);
    if (picker.mode === "image") {
      editor.chain().focus().setImage({ src, alt: media.altText ?? "" }).run();
    } else {
      editor.chain().focus().setVideo({ src }).run();
    }
    setPicker(null);
  }

  const currentColor = editor?.getAttributes("textStyle").color as
    | string
    | undefined;
  const currentHighlight = editor?.getAttributes("highlight").color as
    | string
    | undefined;
  const currentSize = editor?.getAttributes("textStyle").fontSize as
    | string
    | undefined;

  return (
    <div className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <ToolButton
          title="Deshacer"
          disabled={disabled || !editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </ToolButton>
        <ToolButton
          title="Rehacer"
          disabled={disabled || !editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </ToolButton>
        <Divider />

        <Menu
          label="Estilo de bloque"
          title="Párrafo, títulos"
          icon={<Type size={17} />}
          disabled={disabled}
        >
          {(close) => (
            <>
              <MenuItem
                close={close}
                active={editor?.isActive("paragraph") ?? false}
                onSelect={() => editor?.chain().focus().setParagraph().run()}
                icon={<Type size={15} />}
                label="Párrafo"
              />
              <MenuItem
                close={close}
                active={editor?.isActive("heading", { level: 2 }) ?? false}
                onSelect={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                icon={<Heading2 size={15} />}
                label="Título 2"
              />
              <MenuItem
                close={close}
                active={editor?.isActive("heading", { level: 3 }) ?? false}
                onSelect={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                icon={<Heading3 size={15} />}
                label="Título 3"
              />
              <MenuItem
                close={close}
                active={editor?.isActive("heading", { level: 4 }) ?? false}
                onSelect={() =>
                  editor?.chain().focus().toggleHeading({ level: 4 }).run()
                }
                icon={<Heading4 size={15} />}
                label="Título 4"
              />
            </>
          )}
        </Menu>
        <Divider />

        <ToolButton
          title="Negrita"
          active={editor?.isActive("bold") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </ToolButton>
        <ToolButton
          title="Cursiva"
          active={editor?.isActive("italic") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </ToolButton>
        <ToolButton
          title="Subrayado"
          active={editor?.isActive("underline") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={17} />
        </ToolButton>
        <ToolButton
          title="Tachado"
          active={editor?.isActive("strike") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={17} />
        </ToolButton>
        <ToolButton
          title="Código en línea"
          active={editor?.isActive("code") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code size={17} />
        </ToolButton>
        <ToolButton
          title="Superíndice"
          active={editor?.isActive("superscript") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        >
          <SuperscriptIcon size={17} />
        </ToolButton>
        <ToolButton
          title="Subíndice"
          active={editor?.isActive("subscript") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon size={17} />
        </ToolButton>
        <Divider />

        <Menu
          label="Color del texto"
          title="Color del texto"
          icon={<Palette size={17} />}
          active={!!currentColor}
          disabled={disabled}
        >
          {(close) => (
            <div className="p-1.5">
              <div className="grid grid-cols-5 gap-1.5">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    aria-label={`Color ${c.name}`}
                    onClick={() => {
                      editor?.chain().focus().setColor(c.value).run();
                      close();
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                      currentColor === c.value
                        ? "border-neutral-900 ring-2 ring-neutral-900/30"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <span
                      className="text-base font-bold"
                      style={{ color: c.value }}
                    >
                      A
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  editor?.chain().focus().unsetColor().run();
                  close();
                }}
                className="mt-1.5 w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Sin color
              </button>
            </div>
          )}
        </Menu>
        <Menu
          label="Resaltado"
          title="Color de resaltado"
          icon={<Highlighter size={17} />}
          active={editor?.isActive("highlight") ?? false}
          disabled={disabled}
        >
          {(close) => (
            <div className="p-1.5">
              <div className="grid grid-cols-6 gap-1.5">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.name}
                    aria-label={`Resaltado ${c.name}`}
                    onClick={() => {
                      editor
                        ?.chain()
                        .focus()
                        .toggleHighlight({ color: c.value })
                        .run();
                      close();
                    }}
                    className={`h-7 w-7 rounded-md border ${
                      currentHighlight === c.value
                        ? "border-neutral-900 ring-2 ring-neutral-900/30"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  editor?.chain().focus().unsetHighlight().run();
                  close();
                }}
                className="mt-1.5 w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Sin resaltado
              </button>
            </div>
          )}
        </Menu>
        <Menu
          label="Tamaño de letra"
          title="Tamaño de letra"
          icon={<CaseSensitive size={17} />}
          active={!!currentSize}
          disabled={disabled}
        >
          {(close) => (
            <>
              {FONT_SIZES.map((s) => (
                <MenuItem
                  key={s}
                  close={close}
                  active={currentSize === `${s}px`}
                  onSelect={() =>
                    s === 16
                      ? editor?.chain().focus().unsetFontSize().run()
                      : editor?.chain().focus().setFontSize(`${s}px`).run()
                  }
                  label={s === 16 ? "16 (normal)" : `${s}`}
                />
              ))}
            </>
          )}
        </Menu>
        <ToolButton
          title="Quitar formato"
          disabled={disabled}
          onClick={() =>
            editor?.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <Eraser size={17} />
        </ToolButton>
        <Divider />

        <ToolButton
          title="Alinear a la izquierda"
          active={editor?.isActive({ textAlign: "left" }) ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={17} />
        </ToolButton>
        <ToolButton
          title="Centrar"
          active={editor?.isActive({ textAlign: "center" }) ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={17} />
        </ToolButton>
        <ToolButton
          title="Alinear a la derecha"
          active={editor?.isActive({ textAlign: "right" }) ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={17} />
        </ToolButton>
        <ToolButton
          title="Justificar"
          active={editor?.isActive({ textAlign: "justify" }) ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={17} />
        </ToolButton>
        <Divider />

        <ToolButton
          title="Lista con viñetas"
          active={editor?.isActive("bulletList") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List size={17} />
        </ToolButton>
        <ToolButton
          title="Lista numerada"
          active={editor?.isActive("orderedList") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={17} />
        </ToolButton>
        <ToolButton
          title="Cita"
          active={editor?.isActive("blockquote") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <TextQuote size={17} />
        </ToolButton>
        <ToolButton
          title="Bloque de código"
          active={editor?.isActive("codeBlock") ?? false}
          disabled={disabled}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <SquareCode size={17} />
        </ToolButton>
        <ToolButton
          title="Línea horizontal"
          disabled={disabled}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={17} />
        </ToolButton>
        <Divider />

        <ToolButton
          title="Insertar o editar enlace"
          active={editor?.isActive("link") ?? false}
          disabled={disabled}
          onClick={() => openDialog("link")}
        >
          <Link2 size={17} />
        </ToolButton>
        {editor?.isActive("link") && (
          <ToolButton
            title="Quitar enlace"
            disabled={disabled}
            onClick={() => editor?.chain().focus().unsetLink().run()}
          >
            <Unlink size={17} />
          </ToolButton>
        )}
        <ToolButton
          title="Insertar imagen de la biblioteca"
          disabled={disabled}
          onClick={() => openPicker("image")}
        >
          <ImagePlus size={17} />
        </ToolButton>
        <ToolButton
          title="Insertar vídeo de la biblioteca"
          disabled={disabled}
          onClick={() => openPicker("video")}
        >
          <Clapperboard size={17} />
        </ToolButton>
        <Menu
          label="Tabla"
          title="Tabla"
          icon={<TableIcon size={17} />}
          active={editor?.isActive("table") ?? false}
          disabled={disabled}
        >
          {(close) => (
            <>
              <MenuItem
                close={close}
                onSelect={() =>
                  editor
                    ?.chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
                icon={<TableIcon size={15} />}
                label="Insertar tabla 3×3"
              />
              <MenuItem
                close={close}
                onSelect={() => editor?.chain().focus().addRowAfter().run()}
                icon={<Rows3 size={15} />}
                label="Añadir fila"
              />
              <MenuItem
                close={close}
                onSelect={() => editor?.chain().focus().addColumnAfter().run()}
                icon={<Columns3 size={15} />}
                label="Añadir columna"
              />
              <MenuItem
                close={close}
                onSelect={() => editor?.chain().focus().deleteRow().run()}
                label="Eliminar fila"
              />
              <MenuItem
                close={close}
                onSelect={() => editor?.chain().focus().deleteColumn().run()}
                label="Eliminar columna"
              />
              <MenuItem
                close={close}
                onSelect={() => editor?.chain().focus().toggleHeaderRow().run()}
                label="Fila de cabecera sí/no"
              />
              <MenuItem
                close={close}
                onSelect={() => editor?.chain().focus().deleteTable().run()}
                icon={<Trash2 size={15} />}
                label="Eliminar tabla"
                danger
              />
            </>
          )}
        </Menu>
      </div>

      {dialog && (
        <div className="border-t border-neutral-200 bg-white px-3 py-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              autoFocus
              type="url"
              value={dialog.url}
              onChange={(e) =>
                setDialog({ ...dialog, url: e.target.value, error: "" })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") applyDialog();
                if (e.key === "Escape") setDialog(null);
              }}
              placeholder="https://… o mailto:correo@ejemplo.com"
              className="min-w-0 flex-1 rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-500"
            />
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => setDialog(null)}
                className="rounded-md px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={applyDialog}
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
              >
                Aplicar
              </button>
            </div>
          </div>
          {dialog.error && (
            <p className="mt-1.5 text-xs text-red-600">{dialog.error}</p>
          )}
        </div>
      )}
      {picker && (
        <MediaSelector
          open
          onOpenChange={(v) => {
            if (!v) setPicker(null);
          }}
          acceptedTypes={
            picker.mode === "image" ? [MediaTipo.Imagen] : [MediaTipo.Video]
          }
          title={
            picker.mode === "image" ? "Insertar imagen" : "Insertar vídeo"
          }
          description="Elige de la biblioteca o sube un archivo nuevo."
          valueUrl={picker.currentSrc}
          onSelect={insertFromLibrary}
        />
      )}
    </div>
  );
}

function ToolButton({
  title,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-700 hover:bg-neutral-200/70 disabled:text-neutral-300 disabled:hover:bg-transparent"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-neutral-300" />;
}

function Menu({
  label,
  title,
  icon,
  active = false,
  disabled = false,
  children,
}: {
  label: string;
  title: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="relative">
      <button
        type="button"
        title={title}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled || undefined}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex h-8 items-center gap-0.5 rounded-md px-1.5 transition-colors ${
          active || open
            ? "bg-neutral-900 text-white"
            : "text-neutral-700 hover:bg-neutral-200/70 disabled:text-neutral-300 disabled:hover:bg-transparent"
        }`}
      >
        {icon}
        <ChevronDown size={13} />
      </button>
      {open && !disabled && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-10 cursor-default bg-transparent"
          />
          <div
            role="menu"
            aria-label={label}
            className="absolute left-0 z-20 mt-1 min-w-44 rounded-lg border border-neutral-200 bg-white p-1 text-neutral-900 shadow-lg"
          >
            {children(close)}
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  close,
  onSelect,
  label,
  icon,
  active = false,
  danger = false,
}: {
  close: () => void;
  onSelect: () => void;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onSelect();
        close();
      }}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-neutral-700 hover:bg-neutral-100"
      } ${active ? "font-semibold" : ""}`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {active && <span aria-hidden>✓</span>}
    </button>
  );
}
