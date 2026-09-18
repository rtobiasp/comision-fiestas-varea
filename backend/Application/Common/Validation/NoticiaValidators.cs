using FluentValidation;
using Ganss.Xss;
using System.Text.RegularExpressions;

namespace Application.Common.Validation
{
    /// <summary>
    /// Validadores de contenido HTML para noticias.
    /// Estrategia: allowlist estricta (HtmlSanitizer) + rechazo. No se muta el input,
    /// se rechaza con 400 si el sanitizado difiere o si se elimina algo peligroso.
    /// Genérico (sin atar a TipTap/Quill/CKEditor): la lista de tags/atributos se
    /// amplía en un solo punto (CreateNoticiaSanitizer) cuando se elija editor.
    /// </summary>
    public static class NoticiaValidators
    {
        // Detecta algo con pinta de tag HTML: "<letra", "</", "<!", "<?".
        // Evita falsos positivos tipo "3 < 5".
        private static readonly Regex HtmlTagHint =
            new(@"<\s*(/?\s*[a-zA-Z]|!|\?)", RegexOptions.Compiled);

        /// <summary>
        /// Crea el sanitizador con la policy de Contenido: texto+formato, enlaces,
        /// imágenes y vídeo/audio. Todo lo demás (script, iframe, svg, form, style,
        /// on*, javascript:/data:/vbscript:, ...) se elimina.
        /// </summary>
        internal static HtmlSanitizer CreateNoticiaSanitizer()
        {
            var sanitizer = new HtmlSanitizer();

            // Partir de allowlist explícita en vez de la de por defecto.
            sanitizer.AllowedTags.Clear();
            foreach (var tag in new[]
            {
                // Texto y formato que emite cualquier editor rico genérico
                "p", "br", "strong", "b", "em", "i", "u", "s",
                "ul", "ol", "li", "h2", "h3", "h4",
                "blockquote", "pre", "code", "hr", "span", "div",
                // Tablas simples (contenido estático, sin scripts)
                "table", "thead", "tbody", "tr", "th", "td",
                // Enlaces
                "a",
                // Multimedia (solo http/https, sin data: URIs)
                "img", "figure", "figcaption", "picture",
                "video", "audio", "source", "track"
            })
                sanitizer.AllowedTags.Add(tag);

            sanitizer.AllowedAttributes.Clear();
            // Globales seguros (sin style, sin on*, sin id para evitar DOM clobbering)
            sanitizer.AllowedAttributes.Add("class");
            sanitizer.AllowedAttributes.Add("title");
            // Enlaces
            sanitizer.AllowedAttributes.Add("href");
            sanitizer.AllowedAttributes.Add("target");
            sanitizer.AllowedAttributes.Add("rel");
            // Multimedia
            sanitizer.AllowedAttributes.Add("src");
            sanitizer.AllowedAttributes.Add("alt");
            sanitizer.AllowedAttributes.Add("width");
            sanitizer.AllowedAttributes.Add("height");
            sanitizer.AllowedAttributes.Add("loading");
            sanitizer.AllowedAttributes.Add("controls");
            sanitizer.AllowedAttributes.Add("preload");
            sanitizer.AllowedAttributes.Add("poster");
            sanitizer.AllowedAttributes.Add("playsinline");
            sanitizer.AllowedAttributes.Add("muted");
            sanitizer.AllowedAttributes.Add("loop");
            sanitizer.AllowedAttributes.Add("type");
            sanitizer.AllowedAttributes.Add("media");
            sanitizer.AllowedAttributes.Add("kind");
            sanitizer.AllowedAttributes.Add("srclang");
            sanitizer.AllowedAttributes.Add("label");
            sanitizer.AllowedAttributes.Add("colspan");
            sanitizer.AllowedAttributes.Add("rowspan");
            sanitizer.AllowedAttributes.Add("scope");
            // NOTA: "style", "srcset", "action", "formaction", "xlink:href" y
            // cualquier atributo "on*" quedan fuera a propósito. Para permitir
            // autoplay en <video> añadir aquí "autoplay" (desactivado por UX/datos).

            // Solo estos esquemas de URL. Bloquea javascript:, data:text/html,
            // vbscript:, file:, etc. "mailto" solo tiene sentido en <a href>;
            // en <img src> es inerte, riesgo despreciable.
            sanitizer.AllowedSchemes.Clear();
            sanitizer.AllowedSchemes.Add("http");
            sanitizer.AllowedSchemes.Add("https");
            sanitizer.AllowedSchemes.Add("mailto");

            // Nada de data: URIs (ni siquiera imágenes): al no estar "data" en
            // AllowedSchemes, data:image/svg+xml (con script embebido posible) y
            // el base64 que hincha la BD quedan bloqueados.

            return sanitizer;
        }

        /// <summary>
        /// Núcleo de la comprobación: true si el HTML es seguro.
        /// null/vacío se considera válido aquí (lo gobierna NotEmpty()).
        /// </summary>
        public static bool IsSafeHtmlContent(string? html)
        {
            if (string.IsNullOrEmpty(html))
                return true;

            var sanitizer = CreateNoticiaSanitizer();
            var removed = false;

            // Cualquier eliminación (tag, atributo, estilo o regla CSS) significa
            // que el input traía algo fuera de la allowlist. Las URLs
            // peligrosas (javascript:, data:, vbscript:...) también disparan
            // RemovingAttribute al ser eliminadas, así que quedan cubiertas.
            // No se compara sanitized == input a propósito: el sanitizador
            // normaliza atributos booleanos (controls -> controls="") y eso
            // provocaría falsos rechazos en <video>/<audio> válidos.
            // (El evento FilterUrl no se usa: se dispara por cada URL,
            // también las permitidas.)
            sanitizer.RemovingTag += (_, _) => removed = true;
            sanitizer.RemovingAttribute += (_, _) => removed = true;
            sanitizer.RemovingStyle += (_, _) => removed = true;
            sanitizer.RemovingAtRule += (_, _) => removed = true;

            sanitizer.Sanitize(html);

            return !removed;
        }

        /// <summary>
        /// Regla FluentValidation para el cuerpo HTML de la noticia. Rechaza
        /// scripts, eventos, iframes, svg/math, forms, estilos y URLs peligrosas,
        /// incluidas variantes con mayúsculas o entidades.
        /// </summary>
        public static IRuleBuilderOptions<T, string> IsSafeHtml<T>(
            this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(html => IsSafeHtmlContent(html))
                .WithMessage("El contenido contiene HTML no permitido o potencialmente peligroso.");
        }

        /// <summary>
        /// Regla para campos de texto plano (Título, Subtítulo): no deben
        /// contener etiquetas HTML. Se renderizan escapados en el frontend.
        /// Permite "<" en texto normal ("3 < 5").
        /// </summary>
        public static IRuleBuilderOptions<T, string?> IsPlainText<T>(
            this IRuleBuilder<T, string?> ruleBuilder)
        {
            return ruleBuilder
                .Must(text => text is null || !HtmlTagHint.IsMatch(text))
                .WithMessage("Este campo debe ser texto plano, sin etiquetas HTML.");
        }
    }
}
