using System;
using Moq;
using NUnit.Framework;
using Lab3.Controllers;
using Lab3.Interfaces;

namespace Lab3.Test.ControlerTests
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
