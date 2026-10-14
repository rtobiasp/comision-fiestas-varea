namespace Application.Features.Programaciones.Queries.GetDiasByProgramacion
{
    public class GetDiasByProgramacionQuery
    {
        public Guid ProgramacionId { get; set; }
        public int? Offset { get; set; }
        public int? Limit { get; set; }
        public string? Direction { get; set; }
    }
}
