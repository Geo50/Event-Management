using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Repositories;

namespace Application.Services
{
    public interface IEvent_User_Service
    {
        public Task CreateNewBookmark(Bookmarks bookmark);
        public Task<IEnumerable<Event>> GetEventsInProfile(int UserId);

    }
    public class Event_User_Service : IEvent_User_Service
    {
        private readonly Event_User_Repository _repository;
        public Event_User_Service(Event_User_Repository repository)
        {
            _repository = repository;
        }

        public async Task CreateNewBookmark(Bookmarks bookmark)
        {
            await _repository.CreateNewBookmark(bookmark);
        }
        public async Task<IEnumerable<Event>> GetEventsInProfile(int UserId)
        {
            var result = await _repository.GetEventsInProfile(UserId);
            return result;
        }

    }
}
