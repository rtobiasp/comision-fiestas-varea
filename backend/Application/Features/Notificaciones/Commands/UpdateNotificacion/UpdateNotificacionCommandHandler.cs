using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Notificaciones.Commands.UpdateNotificacion
{
    public class UpdateNotificacionCommandHandler
    {
        private readonly INotificacionRepository _notificacionRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public UpdateNotificacionCommandHandler(
            INotificacionRepository notificacionRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _notificacionRepository = notificacionRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task Handle(
            UpdateNotificacionCommand request,
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

            var existingNotificacion = await _notificacionRepository.GetTrackedAsync(request.Id, cancellationToken);

            existingNotificacion.Titulo = request.Titulo;
            existingNotificacion.Mensaje = request.Mensaje;
            existingNotificacion.Nivel = request.Nivel;
            existingNotificacion.FechaCaducidad = ToUtc(request.FechaCaducidad);
            existingNotificacion.Publicada = request.Publicada;
            existingNotificacion.Fijada = request.Fijada;

            SyncCategorias(existingNotificacion, categorias);
            SyncTags(existingNotificacion, tags);

            await _notificacionRepository.UpdateAsync(existingNotificacion, cancellationToken);
        }

        private static DateTime? ToUtc(DateTime? value)
        {
            if (!value.HasValue)
                return null;

            return value.Value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
                : value.Value.ToUniversalTime();
        }

        private static void SyncCategorias(Notificacion notificacion, List<Categoria> categorias)
        {
            var desiredIds = categorias.Select(c => c.Id).ToHashSet();
            foreach (var actual in notificacion.Categorias
                .Where(c => !desiredIds.Contains(c.Id)).ToList())
            {
                notificacion.Categorias.Remove(actual);
            }

            var actualIds = notificacion.Categorias.Select(c => c.Id).ToHashSet();
            foreach (var categoria in categorias.Where(c => !actualIds.Contains(c.Id)))
            {
                notificacion.Categorias.Add(categoria);
            }
        }

        private static void SyncTags(Notificacion notificacion, List<Tag> tags)
        {
            var desiredIds = tags.Select(t => t.Id).ToHashSet();
            foreach (var actual in notificacion.Tags
                .Where(t => !desiredIds.Contains(t.Id)).ToList())
            {
                notificacion.Tags.Remove(actual);
            }

            var actualIds = notificacion.Tags.Select(t => t.Id).ToHashSet();
            foreach (var tag in tags.Where(t => !actualIds.Contains(t.Id)))
            {
                notificacion.Tags.Add(tag);
            }
        }
    }
}
