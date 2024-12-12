namespace Ice_Cream.Models
{
    public class Subscription
    {
        public int Id { get; set; }
        public string SubType { get; set; }
        public string SubDescription { get; set; }
        public float? SubPrice { get; set; }
        public virtual ICollection<Account> Accounts { get; set; }
    }
}
