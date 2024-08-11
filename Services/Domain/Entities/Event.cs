using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Event
    {
        public int eventid { get; set; }
        public string eventname { get; set; }
        public DateTime eventdate { get; set; }
        public string eventplace { get; set; }
        public string eventtype { get; set; }
        public string eventimage { get; set; }
        public int Organiser_Id { get; set; }
    }
}
