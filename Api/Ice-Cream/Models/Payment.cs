namespace Ice_Cream.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public string PaymentType { get; set; }
        public string PaymentStatus { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<PaymentInfo> PaymentInfos { get; set; }
    }
}
