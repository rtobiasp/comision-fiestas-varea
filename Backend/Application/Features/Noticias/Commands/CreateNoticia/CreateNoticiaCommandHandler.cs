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
            if (string.IsNullOrWhiteSpace(request.Titulo))
                throw new ArgumentException("El título es requerido.", nameof(request.Titulo));
            if (string.IsNullOrWhiteSpace(request.Contenido))
                throw new ArgumentException("El contenido es requerido.", nameof(request.Contenido));

            var noticia = new Noticia
            {
                Titulo = request.Titulo,
                Subtitulo = request.Subtitulo,
                Contenido = request.Contenido,
                Fijada = request.Fijada,
            };

            var newNoticia = await _noticiaRepository.AddAsync(noticia, cancellationToken);
            return newNoticia;
        }
    }
}
