namespace Ice_Cream.Models
{
    public class PaymentInfo
    {
        public int Id { get; set; }
        public int? AccountId { get; set; }
        public int? OrderId { get; set; }
        public int? PaymentId { get; set; }
        public string TransactionId { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string MoMoDetails { get; set; }
        public virtual Account Account { get; set; }
        public virtual Order Order { get; set; }
        public virtual Payment Payment { get; set; }
    }
}
