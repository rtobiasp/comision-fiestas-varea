using Application.Common.Interfaces;
using Application.Features.Notificaciones.Dtos;

namespace Application.Features.Notificaciones.Commands.CreateNotificacion
{
    public class CreateNotificacionCommandHandler
    {
        private readonly INotificacionRepository _notificacionRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public CreateNotificacionCommandHandler(
            INotificacionRepository notificacionRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _notificacionRepository = notificacionRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task<NotificacionDto> Handle(
            CreateNotificacionCommand request,
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

            var notificacion = new Domain.Entities.Notificacion
            {
                Titulo = request.Titulo,
                Mensaje = request.Mensaje,
                Nivel = request.Nivel,
                FechaCaducidad = ToUtc(request.FechaCaducidad),
                Fijada = request.Fijada,
                Categorias = categorias,
                Tags = tags,
            };

            var newNotificacion = await _notificacionRepository.AddAsync(notificacion, cancellationToken);
            return NotificacionMapper.ToDto(newNotificacion);
        }

        private static DateTime? ToUtc(DateTime? value)
        {
            if (!value.HasValue)
                return null;

            return value.Value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
                : value.Value.ToUniversalTime();
        }
    }
}
