﻿using System;
using Moq;
using NUnit.Framework;
using API.Models;
using API.Controllers;
using API.Interfaces;
using API.Services;

namespace API.Test.ControlerTests
{
    class ModelsControllerTest
    {
        private Mock<IModelService> _modelService;
        private ModelsController _modelsController;

        [SetUp]
        public void Setup()
        {
            _modelService = new Mock<IModelService>();
            _modelsController = new ModelsController(_modelService.Object);
        }

        [Test]
        public void Get_InputNothing_ShouldCallReadAllMethodFromService()
        {
            _modelsController.Get();

            _modelService.Verify(m => m.ReadAll(), Times.Once);
        }

        [Test]
        public void Get_InputModelId_ShouldCallReadOneMethodFromService()
        {
            var testId = Guid.NewGuid();

            _modelsController.Get(testId);

            _modelService.Verify(m => m.ReadOne(testId), Times.Once);
        }

        [Test]
        public void Create_InputModel_ShouldDontCallCreateMethod()
        {
            var model = new ModelCreateUpdateRequest()
            {
                Name = "test",
                Description = "test",
                Tags = "[]",
            };

            var response = _modelsController.Post(model);

            _modelService.Verify(m => m.Create(It.IsAny<Model>(), It.IsAny<string>()), Times.Never);
        }

        [Test]
        public void Update_InputModelIdAndModel_ShouldCallUpdateMethodFromService()
        {
            var randomId = Guid.NewGuid();
            var model = new ModelCreateUpdateRequest()
            {
                Name = "test",
                Description = "test",
                Tags = "[]",
            };

            var response = _modelsController.Post(model);

            _modelService.Verify(m => m.Update(randomId, It.IsAny<Model>(), It.IsAny<string>()), Times.Never);
            Assert.Null(response.Value);
        }

        [Test]
        public void Delete_InputModelId_ShouldCallDeleteMethodFromService()
        {
            var randomId = Guid.NewGuid();

            _modelsController.Delete(randomId);

            _modelService.Verify(m => m.Delete(randomId), Times.Once);
        }
    }
}
