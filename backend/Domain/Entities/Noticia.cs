using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Noticia
    {
        public Guid Id { get; set; }
        public string Titulo { get; set; }
        public string Contenido { get; set; }

        public DateTime FechaPublicacion { get; set; } = DateTime.Now;

        public bool esBorrador { get; set; } = true;
        public bool publicada { get; set; } = false;

        public string Autor { get; set; }

        public Noticia(Guid id, string titulo, string contenido, string autor)
        {
            Id = id;
            Titulo = titulo;
            Contenido = contenido;
            Autor = autor;
        }

    }
}
