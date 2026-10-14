namespace Application.Features.Programaciones.Commands.CreateDiaProgramacion
{
    public class CreateDiaProgramacionCommand
    {
        public Guid ProgramacionId { get; set; }
        public DateTime Fecha { get; set; }
    }
}
