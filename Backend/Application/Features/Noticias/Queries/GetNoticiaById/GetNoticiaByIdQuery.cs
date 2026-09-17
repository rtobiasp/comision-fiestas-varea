using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Queries.GetNoticiaById
{
    public class GetNoticiaByIdQuery : IRequest<Noticia>
    {
        public Guid Id { get; set; }
    }
}
