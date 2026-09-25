import { Node, mergeAttributes } from "@tiptap/core";

export interface SetVideoOptions {
  src: string;
  title?: string;
  poster?: string;
  width?: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      /** Inserta un bloque <video> en la posición del cursor. */
      setVideo: (options: SetVideoOptions) => ReturnType;
    };
  }
}

/**
 * Nodo de vídeo compatible con el sanitizador del backend
 * (Application.Common.Validation.NoticiaValidators):
 * emite `<video src controls preload="metadata" ...>` plano,
 * sin <iframe> (YouTube/Vimeo embebido se rechaza con 400) y
 * sin data: URIs. Solo URLs http(s) de ficheros (mp4/webm/ogg).
 */
export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: null },
      poster: { default: null },
      width: { default: null },
      controls: { default: true },
      preload: { default: "metadata" },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
