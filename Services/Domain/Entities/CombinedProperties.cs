using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CombinedProperties
    {
        public int EventId { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public string EventPlace { get; set; }
        public string EventType { get; set; }
        public string EventImage { get; set; }
        public int EventDetailId { get; set; }
        public string EventDescription { get; set; }
        public int TicketId { get; set; }
        public string TicketName { get; set; }
        public int TicketPrice { get; set; }
    }
}
