using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Eventos.Commands.UpdateEvento
{
    public class UpdateEventoCommandHandler
    {
        private readonly IEventoRepository _eventoRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public UpdateEventoCommandHandler(
            IEventoRepository eventoRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _eventoRepository = eventoRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task Handle(
            UpdateEventoCommand request,
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

            var existingEvento = await _eventoRepository.GetTrackedAsync(request.Id, cancellationToken);

            existingEvento.Titulo = request.Titulo;
            existingEvento.Descripcion = request.Descripcion;
            existingEvento.Lugar = request.Lugar;
            existingEvento.FechaInicio = request.FechaInicio.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(request.FechaInicio, DateTimeKind.Utc)
                : request.FechaInicio.ToUniversalTime();
            existingEvento.FechaFin = request.FechaFin.HasValue
                ? (request.FechaFin.Value.Kind == DateTimeKind.Unspecified
                    ? DateTime.SpecifyKind(request.FechaFin.Value, DateTimeKind.Utc)
                    : request.FechaFin.Value.ToUniversalTime())
                : null;
            existingEvento.ImagenPortada = string.IsNullOrWhiteSpace(request.ImagenPortada) ? null : request.ImagenPortada.Trim();
            existingEvento.Publicada = request.Publicada;
            existingEvento.Fijada = request.Fijada;
            existingEvento.Aforo = request.Aforo;

            SyncCategorias(existingEvento, categorias);
            SyncTags(existingEvento, tags);

            await _eventoRepository.UpdateAsync(existingEvento, cancellationToken);
        }

        private static void SyncCategorias(Evento evento, List<Categoria> categorias)
        {
            var desiredIds = categorias.Select(c => c.Id).ToHashSet();
            foreach (var actual in evento.Categorias
                .Where(c => !desiredIds.Contains(c.Id)).ToList())
            {
                evento.Categorias.Remove(actual);
            }

            var actualIds = evento.Categorias.Select(c => c.Id).ToHashSet();
            foreach (var categoria in categorias.Where(c => !actualIds.Contains(c.Id)))
            {
                evento.Categorias.Add(categoria);
            }
        }

        private static void SyncTags(Evento evento, List<Tag> tags)
        {
            var desiredIds = tags.Select(t => t.Id).ToHashSet();
            foreach (var actual in evento.Tags
                .Where(t => !desiredIds.Contains(t.Id)).ToList())
            {
                evento.Tags.Remove(actual);
            }

            var actualIds = evento.Tags.Select(t => t.Id).ToHashSet();
            foreach (var tag in tags.Where(t => !actualIds.Contains(t.Id)))
            {
                evento.Tags.Add(tag);
            }
        }
    }
}
