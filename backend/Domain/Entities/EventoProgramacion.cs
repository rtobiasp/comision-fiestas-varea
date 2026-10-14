using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class EventoProgramacion
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }

        public EventoProgramacion()
        {

        }

        public EventoProgramacion(string nombre, string descripcion, DateTime fechaInicio)
        {
            Nombre = nombre;
            Descripcion = descripcion;
            FechaInicio = fechaInicio;
        }
    }
}
