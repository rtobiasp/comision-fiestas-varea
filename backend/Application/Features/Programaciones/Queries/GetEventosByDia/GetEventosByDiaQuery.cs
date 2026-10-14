namespace Application.Features.Programaciones.Queries.GetEventosByDia
{
    public class GetEventosByDiaQuery
    {
        public Guid DiaId { get; set; }
        public int? Offset { get; set; }
        public int? Limit { get; set; }
        public string? Direction { get; set; }
    }
}
