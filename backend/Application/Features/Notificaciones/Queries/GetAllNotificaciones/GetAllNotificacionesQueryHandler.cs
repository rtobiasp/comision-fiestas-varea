using Application.Common.Interfaces;
using Application.Features.Notificaciones.Dtos;
using Domain.Entities;

namespace Application.Features.Notificaciones.Queries.GetAllNotificaciones
{
    public class GetAllNotificacionesQueryHandler
    {
        private readonly INotificacionRepository _notificacionRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly ITagRepository _tagRepository;

        public GetAllNotificacionesQueryHandler(
            INotificacionRepository notificacionRepository,
            ICategoriaRepository categoriaRepository,
            ITagRepository tagRepository)
        {
            _notificacionRepository = notificacionRepository;
            _categoriaRepository = categoriaRepository;
            _tagRepository = tagRepository;
        }

        public async Task<List<NotificacionDto>> Handle(
            GetAllNotificacionesQuery request,
            CancellationToken cancellationToken)
        {
            var hasCategoria = request.CategoriaId.HasValue && request.CategoriaId.Value != Guid.Empty;
            var hasTag = request.TagId.HasValue && request.TagId.Value != Guid.Empty;

            List<Notificacion> notificaciones;

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

                notificaciones = await _notificacionRepository.GetByCategoriaAndTagAsync(
                    request.CategoriaId.Value, request.TagId.Value, request.Offset, request.Limit, cancellationToken);
            }
            else if (hasCategoria)
            {
                if (!await _categoriaRepository.ExistsAsync(request.CategoriaId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado categorías con los parámetros proporcionados");
                }

                notificaciones = await _notificacionRepository.GetByCategoriaAsync(request.CategoriaId.Value, request.Offset, request.Limit, cancellationToken);
            }
            else if (hasTag)
            {
                if (!await _tagRepository.ExistsAsync(request.TagId!.Value, cancellationToken))
                {
                    throw new KeyNotFoundException("No se han encontrado tags con los parámetros proporcionados");
                }

                notificaciones = await _notificacionRepository.GetByTagAsync(request.TagId.Value, request.Offset, request.Limit, cancellationToken);
            }
            else
            {
                notificaciones = await _notificacionRepository.GetAllAsync(request.Offset, request.Limit, cancellationToken);
            }

            return notificaciones.Select(NotificacionMapper.ToDto).ToList();
        }
    }
}
