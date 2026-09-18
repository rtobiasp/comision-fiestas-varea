using Domain.Entities;
using MediatR;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommand : IRequest<Noticia> {
        public string Titulo { get; set; } = string.Empty;
        public string? Subtitulo { get; set; }
        public string Contenido { get; set; } = string.Empty;
        public bool Fijada { get; set; } = false;
    }
}
