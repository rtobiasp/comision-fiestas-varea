using Application.Common.Interfaces;
using Application.Features.Noticias.Dtos;

namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQueryHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public GetAllNoticiasQueryHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<List<NoticiaDto>> Handle(
            GetAllNoticiasQuery request,
            CancellationToken cancellationToken)
        {
            var noticias = await _noticiaRepository.GetAllAsync(cancellationToken);
            return noticias.Select(n => new NoticiaDto(
                n.Id,
                n.Titulo,
                n.Subtitulo,
                n.Contenido,
                n.Publicada,
                n.Fijada,
                n.CreatedAt,
                n.CreatedBy
            )).ToList();
        }
    }
}
