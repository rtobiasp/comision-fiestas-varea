namespace Application.Features.Programaciones.Commands.CreateEventoProgramacion
{
    public class CreateEventoProgramacionCommand
    {
        public Guid DiaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
    }
}
