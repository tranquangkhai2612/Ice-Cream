namespace Ice_Cream.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string? FeedbackTitle { get; set; }
        public string? FeedbackDescription { get; set; }
        public string? Answer {  get; set; }
        public DateTime FeedbackDate { get; set; }
    }
}
