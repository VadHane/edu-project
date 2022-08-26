using System;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using API.Exceptions;
using API.Models;
using API.Services;

namespace API.Test.ServiceTests
{
    class HistoryServiceTest
    {
        private HistoryService _historyService;
        private ModelContext _DBContext;

        [SetUp]
        public void Setup()
        {
            var optionts = new DbContextOptionsBuilder<ModelContext>()
                .UseInMemoryDatabase("Test DB")
                .Options;

            _DBContext = new ModelContext(optionts);
            _historyService = new HistoryService(_DBContext);
        }

        [Test]
        public void ReadAll_InputIncorrectModelId_ShouldReturnAllHistoryRows()
        {
            var incorrectModelId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => _historyService.ReadAll(incorrectModelId));
        }
    }
}
