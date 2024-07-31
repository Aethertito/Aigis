using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mvcfarm1.Migrations
{
    /// <inheritdoc />
    public partial class CuartaMigracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Company_PackageId",
                table: "Company",
                column: "PackageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Company_Package_PackageId",
                table: "Company",
                column: "PackageId",
                principalTable: "Package",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Company_Package_PackageId",
                table: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Company_PackageId",
                table: "Company");
        }
    }
}
