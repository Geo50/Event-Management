using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.EventDTOs
{
    public class GetEventsDTO
    {   
        public int EventId { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public string EventPlace { get; set; }
        public string EventType { get; set; }
        public string EventImage { get; set; }
    }
}
