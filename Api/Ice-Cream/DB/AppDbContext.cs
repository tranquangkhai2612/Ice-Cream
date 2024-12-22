using Ice_Cream.Models;
using Microsoft.EntityFrameworkCore;

namespace Ice_Cream.DB
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Feedback> Feadbacks { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
    }

}
