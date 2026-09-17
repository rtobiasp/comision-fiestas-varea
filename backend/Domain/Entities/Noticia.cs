using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Noticia : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Contenido { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;
        public bool EsBorrador { get; set; } = true;
        public bool Publicada { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }

        // Constructor para EF Core
        public Noticia()
        {
        }

        public Noticia(string titulo, string contenido, string autor)
        {
            Titulo = titulo;
            Contenido = contenido;
            Autor = autor;
        }

    }
}
