using Ice_Cream.DB;
using Ice_Cream.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Net.Mail;
using System.Net.Http.Headers;
using System.Text;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("logs/payment_logs.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
// Add services to the container.

builder.Services.AddControllers();
builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IBookService, BookService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var connectionString = builder.Configuration.GetConnectionString("MySqlConn");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
         policy => 
         {
             policy.AllowAnyOrigin()
             .AllowAnyMethod()
             .AllowAnyHeader();
         }
        );
});
builder.Services.AddTransient<SmtpClient>();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(1);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddHttpClient("PayPal", client =>
{
    var config = builder.Configuration.GetSection("PayPal");
    client.BaseAddress = new Uri(config["BaseUrl"] ?? throw new ArgumentNullException("PayPal:BaseUrl"));

    var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{config["ClientId"]}:{config["Secret"]}"));
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", auth);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseStaticFiles();
app.UseSession();

app.MapControllers();

app.Run();
