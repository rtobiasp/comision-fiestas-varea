using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class Tag : IAuditableEntity
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        [JsonIgnore]
        public ICollection<Noticia> Noticias { get; set; } = new List<Noticia>();
        [JsonIgnore]
        public ICollection<Evento> Eventos { get; set; } = new List<Evento>();
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? LastModifiedAt { get; set; }
        public string? LastModifiedBy { get; set; }
        public static string NormalizeNombre(string nombre) => nombre.Trim().ToLowerInvariant();
    }
}
