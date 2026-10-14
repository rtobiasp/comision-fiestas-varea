using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class DiaProgramacion
    {
        public Guid Id { get; set; }
        public DateTime Fecha { get; set; }
        public ICollection<EventoProgramacion> Eventos { get; set; } = new List<EventoProgramacion>();
        public DiaProgramacion()
        {
        }
        public DiaProgramacion(DateTime fecha)
        {
            Fecha = fecha;
        }

        public void addEvento(EventoProgramacion evento)
        {
            Eventos.Add(evento);
        }
    }
}
