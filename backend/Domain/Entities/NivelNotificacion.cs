namespace Domain.Entities
{
    public static class NivelNotificacion
    {
        public const string Info = "Info";
        public const string Aviso = "Aviso";
        public const string Urgente = "Urgente";

        public static readonly string[] Permitidos = { Info, Aviso, Urgente };
    }
}
