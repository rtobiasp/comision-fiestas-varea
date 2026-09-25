using Application.Features.Categorias.Dtos;
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
                noticia.Publicada,
                noticia.Fijada,
                noticia.CreatedAt,
                noticia.CreatedBy,
                noticia.Categorias
                    .OrderBy(c => c.Nombre)
                    .Select(c => new CategoriaResumenDto(c.Id, c.Nombre))
                    .ToList()
            );
        }
    }
}
