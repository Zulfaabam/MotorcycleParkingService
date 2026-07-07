using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorcycleParkingService.Migrations
{
    /// <inheritdoc />
    public partial class ParkingRecordNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "ParkingRecords",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "ParkingRecords");
        }
    }
}
