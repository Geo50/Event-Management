using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTO.EventDTOs;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Repositories;
using SQL_Queries.Queries;

namespace Application.Services
{
    public interface IEvent_User_Service
    {
        public Task CreateNewBookmark(Bookmarks bookmark);
        public Task<IEnumerable<Event>> GetEventsInProfile(int UserId);
        public Task CreateTransaction(TransactionDTO transactionDTO);
        public Task<IEnumerable<TransactionDTO>> GetTransaction(int UserId);
        public Task<IEnumerable<ViewBoughtTicketsDTO>> GetBoughtTickets(int UserId);
        public Task UpdateTicketStatus(UpdateTicketStatusDTO updateTicketStatusDTO);
        public Task IncrementTicketStatus(UpdateTicketStatusDTO updateTicketStatusDTO);
        public Task<int> GetTransactionsPerUserEvent(TransactionCountDTO transactionCountDTO);
        public Task<int> GetTransactionsPerEvent(int eventid);

    }
    public class Event_User_Service : IEvent_User_Service
    {
        private readonly Event_User_Repository _repository;
        private readonly IMapper _mapper;

        public Event_User_Service(Event_User_Repository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> GetTransactionsPerUserEvent(TransactionCountDTO transactionCountDTO)
        {
            var transactionDTO = _mapper.Map<Transaction>(transactionCountDTO);
            var fullTransaction = await _repository.GetTransactionsPerUserEvent(transactionDTO);
            return fullTransaction;
        } 
        public async Task<int> GetTransactionsPerEvent(int eventid)
        {
            var count = await _repository.GetTransactionsPerEvent(eventid);
            return count;
        }
        
        public async Task<IEnumerable<ViewBoughtTicketsDTO>> GetBoughtTickets(int UserId)
        {
            var fullTickets = await _repository.GetBoughtTickets(UserId);
            var ticketsDTO = _mapper.Map<IEnumerable<ViewBoughtTicketsDTO>>(fullTickets);
            return ticketsDTO;
        }

        public async Task UpdateTicketStatus(UpdateTicketStatusDTO updateTicketStatusDTO)
        {
            var ticketsDTO =  _mapper.Map<Tickets>(updateTicketStatusDTO);
            await _repository.UpdateTicketStatus(ticketsDTO);
            
        }
        public async Task IncrementTicketStatus(UpdateTicketStatusDTO updateTicketStatusDTO)
        {
            var ticketsDTO =  _mapper.Map<Tickets>(updateTicketStatusDTO);
            await _repository.IncrementTicketStatus(ticketsDTO);
            
        }


        public async Task CreateNewBookmark(Bookmarks bookmark)
        {
            await _repository.CreateNewBookmark(bookmark);
        }

        public async Task CreateTransaction(TransactionDTO transactionDTO)
        {
            var newTransaction = _mapper.Map<Transaction>(transactionDTO);
            await _repository.CreateTransaction(newTransaction);
        }

        public async Task<IEnumerable<Event>> GetEventsInProfile(int UserId)
        {
            var result = await _repository.GetEventsInProfile(UserId);
            return result;
        }
        public async Task<IEnumerable<TransactionDTO>> GetTransaction(int UserId)
        {
            var transactions = await _repository.GetTransaction(UserId);
            var transactionDtos = _mapper.Map<IEnumerable<TransactionDTO>>(transactions);
            return transactionDtos;
        }

    }
}
