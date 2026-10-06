using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using Domain.Entities;

namespace Application.Features.Noticias.Dtos
{
    internal static class NoticiaMapper
    {
        public static NoticiaDto ToDto(Noticia noticia)
        {
            return new NoticiaDto(
                noticia.Id,
                noticia.Titulo,
                noticia.Subtitulo,
                noticia.Contenido,
                noticia.ImagenPortada,
                noticia.Publicada,
                noticia.Fijada,
                noticia.CreatedAt,
                noticia.CreatedBy,
                noticia.LastModifiedAt,
                noticia.LastModifiedBy,
                noticia.Categorias
                    .OrderBy(c => c.Nombre)
                    .Select(c => new CategoriaResumenDto(c.Id, c.Nombre))
                    .ToList(),
                noticia.Tags
                    .OrderBy(t => t.Nombre)
                    .Select(t => new TagResumenDto(t.Id, t.Nombre))
                    .ToList()
            );
        }
    }
}
