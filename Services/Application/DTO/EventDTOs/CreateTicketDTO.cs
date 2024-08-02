namespace Application.DTO.EventDTOs
{
    public class CreateTicketDTO
    {
        public int EventId { get; set; }
        public string TicketName { get; set; }
        public int TicketPrice { get; set; }
    }
}
