using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Tags.Dtos
{
    public record TagDto(Guid Id, string Nombre, DateTime CreatedAt, string CreatedBy, int NoticiasCount);
}
