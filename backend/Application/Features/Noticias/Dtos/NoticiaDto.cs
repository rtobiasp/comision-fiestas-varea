using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Dtos
{
    public record NoticiaDto(Guid Id, string Titulo, string? Subtitulo, string Contenido, bool Publicada, bool Fijada, DateTime CreatedAt, string CreatedBy);
}
