using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class EventDetails
    {
        public required int EventDetailId { get; set; }
        public required string EventId { get; set; }
        public required string EventDescription { get; set; }
        public required string EventCategory { get; set; }
        public required DateTime EventDate{ get; set; }

    }   
}
