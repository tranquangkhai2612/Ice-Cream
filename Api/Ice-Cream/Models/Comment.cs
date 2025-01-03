//using System;

//namespace Ice_Cream.Models
//{
//    public class Comment
//    {
//        public int Id { get; set; }
//        public string Title { get; set; }
//        public string Description { get; set; }
//        public DateTime CreatedAt { get; set; }
//        public int AccountId { get; set; }
//        public int FaqId { get; set; }
//        public object FAQ { get; internal set; }
//    }
//}
using System;

namespace Ice_Cream.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AccountId { get; set; }
        public int FaqId { get; set; }

        // Navigation property for FAQ
        public virtual FAQ FAQ { get; set; }
    }
}
