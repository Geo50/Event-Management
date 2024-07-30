using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Services
{
    public interface IEvent
    {
        public Task<IEnumerable<Event>> GetEventByName(string EventName);
        public Task<IEnumerable<Event>> GetAllEvents();
        public Task<IEnumerable<Event>> UpdateEventByName(string EventName);
        public Task DeleteEvent(string EventName);
    }

    public class Event : IEvent
    {
        public Task DeleteEvent(string EventName)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> GetAllEvents()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> GetEventByName(string EventName)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Event>> UpdateEventByName(string EventName)
        {
            throw new NotImplementedException();
        }
    }
}
