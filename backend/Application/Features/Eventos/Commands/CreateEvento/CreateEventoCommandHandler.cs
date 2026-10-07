using Application.Common.Interfaces;
using Application.Features.Eventos.Dtos;

namespace Application.Features.Eventos.Commands.CreateEvento
{
    public class CreateEventoCommandHandler
    {
        private readonly IEventoRepository _eventoRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public CreateEventoCommandHandler(
            IEventoRepository eventoRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _eventoRepository = eventoRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task<EventoDto> Handle(
            CreateEventoCommand request,
            CancellationToken cancellationToken)
        {
            var categoriaIds = (request.CategoriaIds ?? new List<Guid>()).Distinct().ToList();
            var categorias = await _categoriaRepository.GetByIdsAsync(categoriaIds, cancellationToken);

            if (categorias.Count != categoriaIds.Count)
            {
                throw new KeyNotFoundException("Alguna de las categorías indicadas no existe.");
            }

            var tagIds = (request.TagIds ?? new List<Guid>()).Distinct().ToList();
            var tags = await _tagRepository.GetByIdsAsync(tagIds, cancellationToken);

            if (tags.Count != tagIds.Count)
            {
                throw new KeyNotFoundException("Alguno de los tags indicados no existe.");
            }

            var evento = new Domain.Entities.Evento
            {
                Titulo = request.Titulo,
                Descripcion = request.Descripcion,
                Lugar = request.Lugar,
                FechaInicio = request.FechaInicio.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc)
                    : request.FechaInicio.ToUniversalTime(),
                FechaFin = request.FechaFin.HasValue
                    ? (request.FechaFin.Value.Kind == DateTimeKind.Unspecified
                        ? DateTime.SpecifyKind(request.FechaFin.Value, DateTimeKind.Utc)
                        : request.FechaFin.Value.ToUniversalTime())
                    : null,
                ImagenPortada = string.IsNullOrWhiteSpace(request.ImagenPortada) ? null : request.ImagenPortada.Trim(),
                Publicada = request.Publicada,
                Fijada = request.Fijada,
                Aforo = request.Aforo,
                Categorias = categorias,
                Tags = tags,
            };

            var newEvento = await _eventoRepository.AddAsync(evento, cancellationToken);
            return EventoMapper.ToDto(newEvento);
        }
    }
}
