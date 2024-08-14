namespace Application.DTO.EventDTOs
{
    public class CreateTicketDTO
    {
        public int EventId { get; set; }
        public required string TicketName { get; set; }
        public int TicketPrice { get; set; }
        public required string Category { get; set; }
        public required string Benefits { get; set; }
        public int Ticket_Limit { get; set; }
    }
}
