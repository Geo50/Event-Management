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
        public required string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public required string EventPlace { get; set; }
        public required string EventType { get; set; }
        public required string EventImage { get; set; }
        public int Organiser_Id { get; set; }
    }
}
