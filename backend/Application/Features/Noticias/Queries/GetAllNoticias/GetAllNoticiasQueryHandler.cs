using Application.Common.Interfaces;
using Application.Features.Noticias.Dtos;
using Domain.Entities;

namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQueryHandler
    {
        private readonly INoticiaRepository _noticiaRepository;
        private readonly ICategoriaRepository _categoriaRepository;

        public GetAllNoticiasQueryHandler(
            INoticiaRepository noticiaRepository,
            ICategoriaRepository categoriaRepository)
        {
            _noticiaRepository = noticiaRepository;
            _categoriaRepository = categoriaRepository;
        }

        public async Task<List<NoticiaDto>> Handle(
            GetAllNoticiasQuery request,
            CancellationToken cancellationToken)
        {
            List<Noticia> noticias;

            if (request.CategoriaId.HasValue && request.CategoriaId.Value != Guid.Empty)
            {
                if (!await _categoriaRepository.ExistsAsync(request.CategoriaId.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado categorías con los parámetros proporcionados");
                }

                noticias = await _noticiaRepository.GetByCategoriaAsync(request.CategoriaId.Value, cancellationToken);
            }
            else
            {
                noticias = await _noticiaRepository.GetAllAsync(cancellationToken);
            }

            return noticias.Select(NoticiaMapper.ToDto).ToList();
        }
    }
}
