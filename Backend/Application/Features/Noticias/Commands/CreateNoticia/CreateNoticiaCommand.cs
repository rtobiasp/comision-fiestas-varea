using Domain.Entities;
using MediatR;

namespace Application.Features.Noticias.Commands.CreateNoticia
{
    public class CreateNoticiaCommand : IRequest<Noticia> {
        public string Titulo { get; set; } = string.Empty;
        public string Contenido { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;
    }
}
