using Application.Common.Interfaces;
using Application.Features.Noticias.Dtos;

namespace Application.Features.Noticias.Queries.GetNoticiaById
{
    public class GetNoticiaByIdQueryHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public GetNoticiaByIdQueryHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<NoticiaDto> Handle(
            GetNoticiaByIdQuery request,
            CancellationToken cancellationToken)
        {
            var noticia = await _noticiaRepository.GetAsync(request.Id, cancellationToken);
            return new NoticiaDto(
                noticia.Id,
                noticia.Titulo,
                noticia.Subtitulo,
                noticia.Contenido,
                noticia.Publicada,
                noticia.Fijada,
                noticia.CreatedAt,
                noticia.CreatedBy
            );
        }
    }
}
