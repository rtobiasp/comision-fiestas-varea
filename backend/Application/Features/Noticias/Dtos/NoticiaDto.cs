using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Dtos
{
    public record NoticiaDto(Guid Id, string Titulo, string? Subtitulo, string Contenido, bool Publicada, bool Fijada, DateTime CreatedAt, string CreatedBy, List<CategoriaResumenDto> Categorias, List<TagResumenDto> Tags);
}
