using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Dtos
{
    public record NoticiaDto(Guid Id, string Titulo, string? Subtitulo, string Contenido, string? ImagenPortada, bool Publicada, bool Fijada, DateTime CreatedAt, string CreatedBy, DateTime? LastModifiedAt, string? LastModifiedBy, List<CategoriaResumenDto> Categorias, List<TagResumenDto> Tags);
}
