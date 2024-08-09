using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.EventDTOs
{
    public class CreateEventDTO
    {
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public string EventPlace { get; set; }
        public string EventType { get; set; }
        public string EventImage { get; set; }
        public string EventDescription { get; set; }
        public string TicketName { get; set; }
        public int TicketPrice { get; set; }
    }
}
