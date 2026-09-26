using Application.Features.Categorias.Dtos;
using Application.Features.Tags.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Notificaciones.Dtos
{
    public record NotificacionDto(Guid Id, string Titulo, string Mensaje, string Nivel, DateTime? FechaCaducidad, bool Publicada, bool Fijada, DateTime CreatedAt, string CreatedBy, List<CategoriaResumenDto> Categorias, List<TagResumenDto> Tags);
}
