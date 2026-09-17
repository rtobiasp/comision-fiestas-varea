using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditNoticia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FechaPublicacion",
                schema: "contenido",
                table: "Noticias",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "contenido",
                table: "Noticias",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            // Las filas preexistentes quedan con "" por el default; normalizar a "system"
            // para coherencia con CurrentUserService (fase 03 OIDC traerá el usuario real).
            migrationBuilder.Sql(
                "UPDATE contenido.\"Noticias\" SET \"CreatedBy\" = 'system' WHERE \"CreatedBy\" = '';");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedAt",
                schema: "contenido",
                table: "Noticias",
                type: "timestamptz",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedBy",
                schema: "contenido",
                table: "Noticias",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "contenido",
                table: "Noticias");

            migrationBuilder.DropColumn(
                name: "LastModifiedAt",
                schema: "contenido",
                table: "Noticias");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                schema: "contenido",
                table: "Noticias");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                schema: "contenido",
                table: "Noticias",
                newName: "FechaPublicacion");
        }
    }
}
