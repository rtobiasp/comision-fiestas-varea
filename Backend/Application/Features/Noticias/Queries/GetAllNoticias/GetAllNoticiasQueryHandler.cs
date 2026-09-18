using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQueryHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public GetAllNoticiasQueryHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<List<Noticia>> Handle(
            GetAllNoticiasQuery request,
            CancellationToken cancellationToken)
        {
            var noticias = await _noticiaRepository.GetAllAsync(cancellationToken);
            return noticias;
        }
    }
}
