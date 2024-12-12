namespace Ice_Cream.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string ContactDetails { get; set; }
        public string Address { get; set; }
        public int? PaymentId { get; set; }
        public int? PaymentInfoId { get; set; }
        public string OrderType { get; set; }
        public float? OrderAmount { get; set; }
        public float? OrderPrice { get; set; }
        public DateTime? CreatedAt { get; set; }
        public virtual Payment Payment { get; set; }
        public virtual PaymentInfo PaymentInfo { get; set; }
        public virtual ICollection<PaymentInfo> PaymentInfos { get; set; }
    }
}
