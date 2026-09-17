using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Commands.DeleteNoticia
{
    public class DeleteNoticiaCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}
