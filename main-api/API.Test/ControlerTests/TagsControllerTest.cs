using System;
using NUnit.Framework;
using Moq;
using API.Models;
using API.Controllers;
using API.Interfaces;

namespace API.Test.ControlerTests
{
    class TagsControllerTest
    {
        private Mock<ITagService> _tagService;
        private TagsController _tagsController;

        [SetUp]
        public void Setup()
        {
            _tagService = new Mock<ITagService>();
            _tagsController = new TagsController(_tagService.Object);
        }

        [Test]
        public void Get_InputNothing_ShouldCallReadAllMethodFromService()
        {
            _tagsController.Get();

            _tagService.Verify(m => m.ReadAll(), Times.Once);
        }

        [Test]
        public void Get_InputSomeTagId_ShouldCallReadOneMethodFromService()
        {
            var testId = Guid.NewGuid();

            _tagsController.Get(testId);

            _tagService.Verify(m => m.ReadOne(testId), Times.Once);
        }

        [Test]
        public void Post_InputSomeTag_ShouldCallCreateMethodFromService()
        {
            var testTag = new Tag()
            {
                Id = Guid.NewGuid(),
                Name = "testTag",
            };

            _tagsController.Post(testTag);

            _tagService.Verify(m => m.Create(testTag), Times.Once);
        }
    }
}
