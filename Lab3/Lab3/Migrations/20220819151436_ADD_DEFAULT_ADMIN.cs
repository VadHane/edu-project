using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Lab3.Services;

namespace Lab3.Migrations
{
    public partial class ADD_DEFAULT_ADMIN : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("41ecd6d5-bdc0-4a5d-a7b0-1e413752bd36"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("51b9016c-ab6a-4407-bf39-971678c196ef"));

            migrationBuilder.RenameColumn(
                name: "isAdmin",
                table: "Roles",
                newName: "IsAdmin");

            var superAdminRoleId = Guid.NewGuid();
            var superAdminUserId = Guid.NewGuid();
            var superAdminDefaultPassword = "admin";

            migrationBuilder.InsertData(
                "Roles",
                new[] { "Id", "Name", "IsAdmin" },
                new object[] { superAdminRoleId, "Super Admin", true });

            migrationBuilder.InsertData(
                "Users",
                new[] { "Id", "Email", "FirstName", "LastName", "ImageBlobKey", "Password" },
                new object[] { superAdminUserId, "admin@admin.ua", "Admin", "Super", null, EncryptionService.GetHash(superAdminDefaultPassword) });

            migrationBuilder.InsertData(
                table: "RoleUser",
                columns: new[] { "RolesId", "UsersId" },
                values: new object[] { superAdminRoleId, superAdminUserId });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsAdmin",
                table: "Roles",
                newName: "isAdmin");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name", "isAdmin" },
                values: new object[] { new Guid("51b9016c-ab6a-4407-bf39-971678c196ef"), "Super Admin", false });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name", "isAdmin" },
                values: new object[] { new Guid("41ecd6d5-bdc0-4a5d-a7b0-1e413752bd36"), "Admin", false });
        }
    }
}
