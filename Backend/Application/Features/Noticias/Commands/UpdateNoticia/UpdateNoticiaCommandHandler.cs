using Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Noticias.Commands.UpdateNoticia
{
    public class UpdateNoticiaCommandHandler : IRequestHandler<UpdateNoticiaCommand>
    {
        private readonly INoticiaRepository _noticiaRepository;

        public UpdateNoticiaCommandHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task Handle(UpdateNoticiaCommand request, CancellationToken cancellationToken)
        {
            if (request.Id == Guid.Empty)
                throw new ArgumentException("El ID de la noticia es requerido.", nameof(request.Id));
            if (string.IsNullOrWhiteSpace(request.Titulo))
                throw new ArgumentException("El título es requerido.", nameof(request.Titulo));
            if (string.IsNullOrWhiteSpace(request.Contenido))
                throw new ArgumentException("El contenido es requerido.", nameof(request.Contenido));
            if (string.IsNullOrWhiteSpace(request.Autor))
                throw new ArgumentException("El autor es requerido.", nameof(request.Autor));

            var existingNoticia = await _noticiaRepository.GetAsync(request.Id, cancellationToken);

            existingNoticia.Titulo = request.Titulo;
            existingNoticia.Contenido = request.Contenido;
            existingNoticia.Autor = request.Autor;
            existingNoticia.EsBorrador = request.EsBorrador;
            existingNoticia.Publicada = request.Publicada;

            await _noticiaRepository.UpdateAsync(existingNoticia, cancellationToken);
        }
    }
}
