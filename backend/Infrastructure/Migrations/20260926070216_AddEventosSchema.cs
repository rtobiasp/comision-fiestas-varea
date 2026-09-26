using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEventosSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "eventos");

            migrationBuilder.CreateTable(
                name: "Eventos",
                schema: "eventos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Titulo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    Lugar = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    Publicado = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Destacado = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Aforo = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamptz", nullable: false, defaultValueSql: "now()"),
                    CreatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastModifiedAt = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eventos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EventoCategorias",
                schema: "eventos",
                columns: table => new
                {
                    EventoId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoriaId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventoCategorias", x => new { x.EventoId, x.CategoriaId });
                    table.ForeignKey(
                        name: "FK_EventoCategorias_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalSchema: "contenido",
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EventoCategorias_Eventos_EventoId",
                        column: x => x.EventoId,
                        principalSchema: "eventos",
                        principalTable: "Eventos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventoTags",
                schema: "eventos",
                columns: table => new
                {
                    EventoId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventoTags", x => new { x.EventoId, x.TagId });
                    table.ForeignKey(
                        name: "FK_EventoTags_Eventos_EventoId",
                        column: x => x.EventoId,
                        principalSchema: "eventos",
                        principalTable: "Eventos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventoTags_Tags_TagId",
                        column: x => x.TagId,
                        principalSchema: "contenido",
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventoCategorias_CategoriaId",
                schema: "eventos",
                table: "EventoCategorias",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_EventoTags_TagId",
                schema: "eventos",
                table: "EventoTags",
                column: "TagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventoCategorias",
                schema: "eventos");

            migrationBuilder.DropTable(
                name: "EventoTags",
                schema: "eventos");

            migrationBuilder.DropTable(
                name: "Eventos",
                schema: "eventos");
        }
    }
}
