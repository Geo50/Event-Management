using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.EventDTOs
{
    public class ViewBoughtTicketsDTO
    {
        public int EventId {  get; set; }
        public required string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public required string EventPlace { get; set; }
        public int TicketId { get; set; }
        public required string TicketName { get; set; }
        public required string Category { get; set; }
        public required string Benefits { get; set; }
    }
}
