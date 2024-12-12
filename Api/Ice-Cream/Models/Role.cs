namespace Ice_Cream.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public virtual ICollection<Account> Accounts { get; set; }
    }
}
