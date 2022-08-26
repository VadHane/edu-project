using System;
using Moq;
using NUnit.Framework;
using API.Controllers;
using API.Interfaces;

namespace API.Test.ControlerTests
{
    class HistoriesControllerTest
    {
        private Mock<IHistoryService> _historyService;
        private HistoriesController _historyController;

        [SetUp]
        public void Setup()
        {
            _historyService = new Mock<IHistoryService>();
            _historyController = new HistoriesController(_historyService.Object);
        }

        [Test]
        public void Get_InputModelId_ShouldCallReadOneMethodFromService()
        {
            var testId = Guid.NewGuid();

            _historyController.Get(testId);

            _historyService.Verify(m => m.ReadAll(testId), Times.Once);
        }
    }
}
