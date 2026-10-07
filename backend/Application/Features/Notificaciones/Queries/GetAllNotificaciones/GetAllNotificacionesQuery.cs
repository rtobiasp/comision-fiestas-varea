namespace Application.Features.Notificaciones.Queries.GetAllNotificaciones
{
    public class GetAllNotificacionesQuery
    {
        public Guid? CategoriaId { get; set; }
        public Guid? TagId { get; set; }
        public int? Offset { get; set; }
        public int? Limit { get; set; }
    }
}
