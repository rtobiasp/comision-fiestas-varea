using Application.Common.Interfaces;
using Domain.Entities;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    // Handler Wolverine: clase pública sin interfaces. Wolverine lo asocia al
    // mensaje por el tipo del primer parámetro de Handle().
    // La dependencia se pide por constructor (como con MediatR): así la
    // resuelve el contenedor DI de .NET y el generador de código de Wolverine
    // no necesita "ver" cómo se construye (evita ServiceLocationPolicy).
    // Lo que devuelve Handle() es la respuesta de InvokeAsync<T>().
    public class CreateNoticiaCommandHandler
    {
        private readonly INoticiaRepository _noticiaRepository;

        public CreateNoticiaCommandHandler(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        public async Task<Noticia> Handle(
            CreateNoticiaCommand request,
            CancellationToken cancellationToken)
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
