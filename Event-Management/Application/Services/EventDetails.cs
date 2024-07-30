using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public interface IEventDetails
    {
        Task<string> GetEventDescription(string EventName);
        Task<string> GetEventCategory(string EventName);

    }
    public class EventDetails : IEventDetails
    {
        public Task<string> GetEventCategory(string EventName)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetEventDescription(string EventName)
        {
            throw new NotImplementedException();
        }
    }
}
