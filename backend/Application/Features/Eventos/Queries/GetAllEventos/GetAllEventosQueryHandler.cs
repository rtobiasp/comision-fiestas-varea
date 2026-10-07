using Application.Common.Interfaces;
using Application.Features.Eventos.Dtos;
using Domain.Entities;

namespace Application.Features.Eventos.Queries.GetAllEventos
{
    public class GetAllEventosQueryHandler
    {
        private readonly IEventoRepository _eventoRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public GetAllEventosQueryHandler(
            IEventoRepository eventoRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _eventoRepository = eventoRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task<List<EventoDto>> Handle(
            GetAllEventosQuery request,
            CancellationToken cancellationToken)
        {
            var hasCategoria = request.CategoriaId.HasValue && request.CategoriaId.Value != Guid.Empty;
            var hasTag = request.TagId.HasValue && request.TagId.Value != Guid.Empty;
            var orderBy = string.Equals(request.OrderBy, "titulo", StringComparison.OrdinalIgnoreCase) ? "titulo" : "fecha";
            var descending = !string.Equals(request.Direction, "asc", StringComparison.OrdinalIgnoreCase);

            List<Evento> eventos;

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

                eventos = await _eventoRepository.GetByCategoriaAndTagAsync(
                    request.CategoriaId.Value, request.TagId.Value, request.Offset, request.Limit, request.Publicada, orderBy, descending, cancellationToken);
            }
            else if (hasCategoria)
            {
                if (!await _categoriaRepository.ExistsAsync(request.CategoriaId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado categorías con los parámetros proporcionados");
                }

                eventos = await _eventoRepository.GetByCategoriaAsync(request.CategoriaId.Value, request.Offset, request.Limit, request.Publicada, orderBy, descending, cancellationToken);
            }
            else if (hasTag)
            {
                if (!await _tagRepository.ExistsAsync(request.TagId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado tags con los parámetros proporcionados");
                }

                eventos = await _eventoRepository.GetByTagAsync(request.TagId.Value, request.Offset, request.Limit, request.Publicada, orderBy, descending, cancellationToken);
            }
            else
            {
                eventos = await _eventoRepository.GetAllAsync(request.Offset, request.Limit, request.Publicada, orderBy, descending, cancellationToken);
            }

            return eventos.Select(EventoMapper.ToDto).ToList();
        }
    }
}
