namespace Application.Features.Programaciones.Queries.GetAllProgramaciones
{
    public class GetAllProgramacionesQuery
    {
        public int? Offset { get; set; }
        public int? Limit { get; set; }
        public string? OrderBy { get; set; }
        public string? Direction { get; set; }
    }
}
