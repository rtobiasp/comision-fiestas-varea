namespace Application.Features.Eventos.Commands.CreateEvento
{
    public class CreateEventoCommand
    {
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Lugar { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? ImagenPortada { get; set; }
        public bool Publicada { get; set; } = false;
        public bool Fijada { get; set; } = false;
        public int? Aforo { get; set; }
        public List<Guid> CategoriaIds { get; set; } = new();
        public List<Guid> TagIds { get; set; } = new();
    }
}
