using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Noticia
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Contenido { get; set; } = string.Empty;
        public string Autor { get; set; } = string.Empty;

        public DateTime FechaPublicacion { get; set; } = DateTime.UtcNow;

        public bool esBorrador { get; set; } = true;
        public bool publicada { get; set; } = false;

        // Constructor para EF Core
        private Noticia()
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
