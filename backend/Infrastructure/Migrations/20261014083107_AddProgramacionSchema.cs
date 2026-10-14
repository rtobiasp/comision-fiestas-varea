using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProgramacionSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "programacion");

            migrationBuilder.CreateTable(
                name: "Programaciones",
                schema: "programacion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamptz", nullable: false, defaultValueSql: "now()"),
                    CreatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastModifiedAt = table.Column<DateTime>(type: "timestamptz", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Programaciones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiasProgramacion",
                schema: "programacion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Fecha = table.Column<DateTime>(type: "date", nullable: false),
                    ProgramacionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiasProgramacion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiasProgramacion_Programaciones_ProgramacionId",
                        column: x => x.ProgramacionId,
                        principalSchema: "programacion",
                        principalTable: "Programaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventosProgramacion",
                schema: "programacion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "timestamptz", nullable: false),
                    DiaProgramacionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventosProgramacion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventosProgramacion_DiasProgramacion_DiaProgramacionId",
                        column: x => x.DiaProgramacionId,
                        principalSchema: "programacion",
                        principalTable: "DiasProgramacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiasProgramacion_ProgramacionId",
                schema: "programacion",
                table: "DiasProgramacion",
                column: "ProgramacionId");

            migrationBuilder.CreateIndex(
                name: "IX_DiasProgramacion_ProgramacionId_Fecha",
                schema: "programacion",
                table: "DiasProgramacion",
                columns: new[] { "ProgramacionId", "Fecha" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventosProgramacion_DiaProgramacionId",
                schema: "programacion",
                table: "EventosProgramacion",
                column: "DiaProgramacionId");

            migrationBuilder.CreateIndex(
                name: "IX_EventosProgramacion_DiaProgramacionId_FechaInicio",
                schema: "programacion",
                table: "EventosProgramacion",
                columns: new[] { "DiaProgramacionId", "FechaInicio" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventosProgramacion",
                schema: "programacion");

            migrationBuilder.DropTable(
                name: "DiasProgramacion",
                schema: "programacion");

            migrationBuilder.DropTable(
                name: "Programaciones",
                schema: "programacion");
        }
    }
}
