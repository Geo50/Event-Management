using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Bookmarks
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
        public string EventName{ get; set; }
    }
}
