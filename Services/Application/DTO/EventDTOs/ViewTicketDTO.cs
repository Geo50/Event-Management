using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.EventDTOs
{
    public class ViewTicketDTO
    {
        public required string TicketId { get; set; }
        public required string TicketName { get; set; }
        public int TicketPrice { get; set; }
        public required string Category { get; set; }
        public required string Benefits { get; set; }
        public int Ticket_Limit { get; set; }
    }
}
