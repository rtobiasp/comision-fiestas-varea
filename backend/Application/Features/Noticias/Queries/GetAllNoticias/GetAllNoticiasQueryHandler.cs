using Application.Common.Interfaces;
using Application.Features.Noticias.Dtos;
using Domain.Entities;

namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQueryHandler
    {
        private readonly INoticiaRepository _noticiaRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public GetAllNoticiasQueryHandler(
            INoticiaRepository noticiaRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _noticiaRepository = noticiaRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task<List<NoticiaDto>> Handle(
            GetAllNoticiasQuery request,
            CancellationToken cancellationToken)
        {
            var hasCategoria = request.CategoriaId.HasValue && request.CategoriaId.Value != Guid.Empty;
            var hasTag = request.TagId.HasValue && request.TagId.Value != Guid.Empty;

            List<Noticia> noticias;

            if (hasCategoria && hasTag)
            {
                if (!await _categoriaRepository.ExistsAsync(request.CategoriaId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado categorías con los parámetros proporcionados");
                }

                if (!await _tagRepository.ExistsAsync(request.TagId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado tags con los parámetros proporcionados");
                }

                noticias = await _noticiaRepository.GetByCategoriaAndTagAsync(
                    request.CategoriaId.Value, request.TagId.Value, request.Offset, request.Limit, cancellationToken);
            }
            else if (hasCategoria)
            {
                if (!await _categoriaRepository.ExistsAsync(request.CategoriaId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado categorías con los parámetros proporcionados");
                }

                noticias = await _noticiaRepository.GetByCategoriaAsync(request.CategoriaId.Value, request.Offset, request.Limit, cancellationToken);
            }
            else if (hasTag)
            {
                if (!await _tagRepository.ExistsAsync(request.TagId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado tags con los parámetros proporcionados");
                }

                noticias = await _noticiaRepository.GetByTagAsync(request.TagId.Value, request.Offset, request.Limit, cancellationToken);
            }
            else
            {
                noticias = await _noticiaRepository.GetAllAsync(request.Offset, request.Limit, cancellationToken);
            }

            return noticias.Select(NoticiaMapper.ToDto).ToList();
        }
    }
}
