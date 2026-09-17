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
        public string Contenido { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;
        public bool EsBorrador { get; set; }
        public bool Publicada { get; set; }
    }
}
