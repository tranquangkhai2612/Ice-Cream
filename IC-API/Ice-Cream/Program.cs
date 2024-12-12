using Ice_Cream.DB;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(policyBuilder =>
    policyBuilder.AddDefaultPolicy(policy =>
        policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod())
);

builder.Services.AddControllers(); // Add controllers

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Entity Framework with MySQL
var connectionString = builder.Configuration.GetConnectionString("MySqlConn");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

// Configure SMTP
builder.Services.AddTransient<SmtpClient>();

// Configure session handling
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(1); // Session timeout
    options.Cookie.HttpOnly = true; // Make cookies accessible only via HTTP
    options.Cookie.IsEssential = true; // Ensure session cookies are essential
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Enable CORS
app.UseCors();

// Enable session middleware
app.UseSession();

// Enable authorization middleware
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Run the application
app.Run();
