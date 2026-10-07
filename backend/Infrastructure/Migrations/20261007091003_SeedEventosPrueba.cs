using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedEventosPrueba : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                schema: "eventos",
                table: "Eventos",
                columns: new[] { "Id", "Titulo", "Descripcion", "Lugar", "FechaInicio", "FechaFin", "ImagenPortada", "Publicada", "Fijada", "Aforo", "CreatedAt", "CreatedBy", "LastModifiedAt", "LastModifiedBy" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Pregón inaugural de las fiestas", "<p>Acto oficial de apertura con el pregón desde el balcón del ayuntamiento y reparto de pañuelos.</p>", "Plaza Mayor", new DateTime(2026, 8, 14, 20, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 14, 22, 0, 0, DateTimeKind.Utc), "/uploads/eventos/pregon.jpg", true, true, null, new DateTime(2026, 6, 1, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Verbena de verano", "<p>Orquesta en directo, barra popular y pista de baile hasta la madrugada.</p>", "Parque Central", new DateTime(2026, 8, 15, 23, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 16, 3, 0, 0, DateTimeKind.Utc), "/uploads/eventos/verbena.jpg", true, false, 500, new DateTime(2026, 6, 2, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "Concurso de paellas", "<p>Inscripción por cuadrillas. La organización aporta leña y paellero; cada grupo trae sus ingredientes.</p>", "Recinto ferial", new DateTime(2026, 8, 16, 12, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 16, 16, 0, 0, DateTimeKind.Utc), null, true, false, 120, new DateTime(2026, 6, 3, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Taller infantil de cabezudos", "<p>Manualidades para los más pequeños: construye tu propio cabezudo con material reciclado.</p>", "Centro cívico", new DateTime(2026, 7, 20, 11, 0, 0, DateTimeKind.Utc), new DateTime(2026, 7, 20, 13, 0, 0, DateTimeKind.Utc), null, true, false, 30, new DateTime(2026, 6, 4, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "Concierto de la banda municipal", "<p>Repertorio festivo con pasodobles y piezas populares en el quiosco de música.</p>", "Quiosco de música", new DateTime(2026, 9, 25, 19, 30, 0, DateTimeKind.Utc), new DateTime(2026, 9, 25, 21, 0, 0, DateTimeKind.Utc), "/uploads/eventos/banda.jpg", true, false, null, new DateTime(2026, 6, 5, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("66666666-6666-6666-6666-666666666666"), "Encierro chiqui", "<p>Encierro infantil con carretones para que los peques vivan la fiesta con seguridad.</p>", "Calle Mayor", new DateTime(2026, 8, 17, 10, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 17, 11, 30, 0, DateTimeKind.Utc), null, false, false, null, new DateTime(2026, 6, 6, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("77777777-7777-7777-7777-777777777777"), "Cena popular de hermandad", "<p>Caldereta popular con sobremesa y música. Tickets a la venta en el local de la comisión.</p>", "Frontón municipal", new DateTime(2026, 8, 18, 21, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 19, 0, 0, 0, DateTimeKind.Utc), "/uploads/eventos/cena.jpg", false, false, 200, new DateTime(2026, 6, 7, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("88888888-8888-8888-8888-888888888888"), "Misa solemne en honor al patrón", "<p>Celebración religiosa con la participación del coro parroquial y ofrenda floral.</p>", "Iglesia de San Martín", new DateTime(2026, 8, 15, 12, 0, 0, DateTimeKind.Utc), new DateTime(2026, 8, 15, 13, 0, 0, DateTimeKind.Utc), null, true, true, null, new DateTime(2026, 6, 8, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("99999999-9999-9999-9999-999999999999"), "Castillo de fuegos artificiales", "<p>Gran cierre de fiestas con espectáculo pirotécnico desde la explanada del río.</p>", "Explanada del río", new DateTime(2026, 8, 19, 23, 30, 0, DateTimeKind.Utc), null, "/uploads/eventos/fuegos.jpg", true, true, null, new DateTime(2026, 6, 9, 10, 0, 0, DateTimeKind.Utc), "seed", null, null },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Asamblea de la comisión", "<p>Reunión interna para repasar el presupuesto y cerrar el programa definitivo.</p>", "Local de la comisión", new DateTime(2026, 9, 10, 18, 0, 0, DateTimeKind.Utc), new DateTime(2026, 9, 10, 20, 0, 0, DateTimeKind.Utc), null, false, false, 25, new DateTime(2026, 6, 10, 10, 0, 0, DateTimeKind.Utc), "seed", null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("11111111-1111-1111-1111-111111111111"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("22222222-2222-2222-2222-222222222222"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("33333333-3333-3333-3333-333333333333"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("44444444-4444-4444-4444-444444444444"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("55555555-5555-5555-5555-555555555555"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("66666666-6666-6666-6666-666666666666"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("77777777-7777-7777-7777-777777777777"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("88888888-8888-8888-8888-888888888888"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("99999999-9999-9999-9999-999999999999"));
            migrationBuilder.DeleteData(schema: "eventos", table: "Eventos", keyColumn: "Id", keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));
        }
    }
}
