using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Add FluentValidation
builder.Services.AddScoped<IValidator<CreateParkingRecordDto>, CreateParkingRecordValidator>();
builder.Services.AddScoped<IValidator<UpdateParkingRecordDto>, UpdateParkingRecordValidator>();
// builder.Services.AddScoped<IValidator<RegisterDto>, RegisterValidator>();
// builder.Services.AddScoped<IValidator<LoginDto>, LoginValidator>();

// Add Repositories
builder.Services.AddScoped<IParkingRecordRepository, ParkingRecordRepository>();

// Add Services
builder.Services.AddScoped<IParkingRecordService, ParkingRecordService>();
// builder.Services.AddScoped<IAuthService, AuthService>();

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
