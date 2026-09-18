using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Application.Features.Noticias.Commands.UpdateNoticia
{
    public class UpdateNoticiaCommand : IRequest
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Subtitulo { get; set; }
        public string Contenido { get; set; } = string.Empty;
        public bool Publicada { get; set; }
        public bool Fijada { get; set; }
    }
}
