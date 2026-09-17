using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Queries.GetNoticiaById
{
    internal class GetNoticiaByIdQueryHandler : IRequestHandler<GetNoticiaByIdQuery, Noticia>
    {
        private readonly INoticiaRepository _noticiaRepository;

        public GetNoticiaByIdQueryHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<Noticia> Handle(GetNoticiaByIdQuery request, CancellationToken cancellationToken)
        {
            if (request.Id == Guid.Empty)
                throw new ArgumentException("El ID de la noticia es requerido.", nameof(request.Id));

            return await _noticiaRepository.GetAsync(request.Id, cancellationToken);
        }
    }
}
