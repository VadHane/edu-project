using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class Add_IsAdmin_Field_Into_Roles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("4e0a80a4-3e63-4f0d-b514-88e8c74a21e9"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("8f01ea2c-957f-4b35-9f53-244446f0b814"));

            migrationBuilder.AddColumn<bool>(
                name: "isAdmin",
                table: "Roles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name", "isAdmin" },
                values: new object[] { new Guid("51b9016c-ab6a-4407-bf39-971678c196ef"), "Super Admin", false });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name", "isAdmin" },
                values: new object[] { new Guid("41ecd6d5-bdc0-4a5d-a7b0-1e413752bd36"), "Admin", false });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("41ecd6d5-bdc0-4a5d-a7b0-1e413752bd36"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("51b9016c-ab6a-4407-bf39-971678c196ef"));

            migrationBuilder.DropColumn(
                name: "isAdmin",
                table: "Roles");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("4e0a80a4-3e63-4f0d-b514-88e8c74a21e9"), "Super Admin" });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("8f01ea2c-957f-4b35-9f53-244446f0b814"), "Admin" });
        }
    }
}
