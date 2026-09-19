using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Categoria : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }
    }
}
