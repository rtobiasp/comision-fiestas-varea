using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Noticias.Queries.GetNoticiaById
{
    public class GetNoticiaByIdQueryHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public GetNoticiaByIdQueryHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<Noticia> Handle(
            GetNoticiaByIdQuery request,
            CancellationToken cancellationToken)
        {
            return await _noticiaRepository.GetAsync(request.Id, cancellationToken);
        }
    }
}
