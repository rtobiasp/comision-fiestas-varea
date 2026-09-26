using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificacionesSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "notificaciones");

            migrationBuilder.CreateTable(
                name: "Notificaciones",
                schema: "notificaciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Titulo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Mensaje = table.Column<string>(type: "text", nullable: false),
                    Nivel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Info"),
                    FechaCaducidad = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    Publicada = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Fijada = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamptz", nullable: false, defaultValueSql: "now()"),
                    CreatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastModifiedAt = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificaciones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NotificacionCategorias",
                schema: "notificaciones",
                columns: table => new
                {
                    NotificacionId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoriaId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificacionCategorias", x => new { x.NotificacionId, x.CategoriaId });
                    table.ForeignKey(
                        name: "FK_NotificacionCategorias_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalSchema: "contenido",
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NotificacionCategorias_Notificaciones_NotificacionId",
                        column: x => x.NotificacionId,
                        principalSchema: "notificaciones",
                        principalTable: "Notificaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NotificacionTags",
                schema: "notificaciones",
                columns: table => new
                {
                    NotificacionId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificacionTags", x => new { x.NotificacionId, x.TagId });
                    table.ForeignKey(
                        name: "FK_NotificacionTags_Notificaciones_NotificacionId",
                        column: x => x.NotificacionId,
                        principalSchema: "notificaciones",
                        principalTable: "Notificaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NotificacionTags_Tags_TagId",
                        column: x => x.TagId,
                        principalSchema: "contenido",
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NotificacionCategorias_CategoriaId",
                schema: "notificaciones",
                table: "NotificacionCategorias",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificacionTags_TagId",
                schema: "notificaciones",
                table: "NotificacionTags",
                column: "TagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificacionCategorias",
                schema: "notificaciones");

            migrationBuilder.DropTable(
                name: "NotificacionTags",
                schema: "notificaciones");

            migrationBuilder.DropTable(
                name: "Notificaciones",
                schema: "notificaciones");
        }
    }
}
