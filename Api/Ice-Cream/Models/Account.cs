using System.Data;
using System.Xml.Linq;

namespace Ice_Cream.Models
{
    public class Account
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int? SubscriptionId { get; set; }
        public int? RoleId { get; set; }
        public string Email { get; set; }
        public string ContactDetails { get; set; }
        public string Address { get; set; }
        public bool? Active { get; set; }
        public DateTime? SubscriptionStart { get; set; }
        public DateTime? SubscriptionEnd { get; set; }
        public DateTime? CreatedAt { get; set; }
        public virtual Subscription Subscription { get; set; }
        public virtual Role Role { get; set; }
        public virtual ICollection<Comments> Comments { get; set; }
        public virtual ICollection<Rating> Ratings { get; set; }
        public virtual ICollection<PaymentInfo> PaymentInfos { get; set; }
    }
}
