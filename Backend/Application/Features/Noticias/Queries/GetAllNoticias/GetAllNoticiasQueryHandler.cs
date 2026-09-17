using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Queries.GetAllNoticias
{
    public class GetAllNoticiasQueryHandler : IRequestHandler<GetAllNoticiasQuery, List<Noticia>>
    {

        private readonly INoticiaRepository _noticiaRepository;

        public GetAllNoticiasQueryHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }
        public async Task<List<Noticia>> Handle(GetAllNoticiasQuery request, CancellationToken cancellationToken)
        {
            var noticias = await _noticiaRepository.GetAllAsync(cancellationToken);
            return noticias;
        }
    }
}
