using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.EventDTOs
{
    public class CreateEventDTO
    {
        public required string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public required string EventPlace { get; set; }
        public required string EventType { get; set; }
        public required string EventImage { get; set; }
        public required string EventDescription { get; set; }
        public int Organiser_id { get; set; }
        public int EventAttendeesLimit { get; set; }
        public int ticket_limit_per_user { get; set; }

    }
}
