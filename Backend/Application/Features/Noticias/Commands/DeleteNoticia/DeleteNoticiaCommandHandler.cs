using Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Commands.DeleteNoticia
{
    public class DeleteNoticiaCommandHandler : IRequestHandler<DeleteNoticiaCommand>
    {
        private readonly INoticiaRepository _noticiaRepository;
        public DeleteNoticiaCommandHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }
        public async Task Handle(DeleteNoticiaCommand request, CancellationToken cancellationToken)
        {
            if (request.Id == Guid.Empty)
                throw new ArgumentException("El ID de la noticia es requerido.", nameof(request.Id));

            await _noticiaRepository.DeleteAsync(request.Id, cancellationToken);
        }

    }
}
