using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.EventDTOs
{
    public class UpdateTicketStatusDTO
    {
        public int TicketId { get; set; }
        public int EventId { get; set; }
    }
}
