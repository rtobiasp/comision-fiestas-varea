using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommandHandler : IRequestHandler<CreateNoticiaCommand, Noticia>
    {
        private readonly INoticiaRepository _noticiaRepository;

        public CreateNoticiaCommandHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<Noticia> Handle(CreateNoticiaCommand request, CancellationToken cancellationToken)
        {
            var noticia = new Noticia
            {
                Titulo = request.Titulo,
                Contenido = request.Contenido,
                Autor = request.Autor,
            };

            var newNoticia = await _noticiaRepository.AddAsync(noticia);
            return newNoticia;
        }
    }
}
