using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Programacion : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public ICollection<DiaProgramacion> Dias { get; set; } = new List<DiaProgramacion>();
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }

        public Programacion()
        {
        }

        public Programacion(string nombre)
        {
            Nombre = nombre;
        }

        public void addDia(DiaProgramacion dia)
        {
            Dias.Add(dia);
        }
    }
}
