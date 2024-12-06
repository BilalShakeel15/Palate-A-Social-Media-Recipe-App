namespace Palete.models
{
    public class Story
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string MediaUrl { get; set; } 
        public DateTime UploadDate { get; set; }
        public DateTime ExpiryDate => UploadDate.AddHours(24); 
    }

}
