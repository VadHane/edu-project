using System;
using NUnit.Framework;
using Moq;
using Lab3.Models;
using Lab3.Controllers;
using Lab3.Interfaces;

namespace Lab3.Test.ControlerTests
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
            var testRoleId = Guid.NewGuid();

            _tagsController.Get(testRoleId);

            _tagService.Verify(m => m.ReadOne(testRoleId), Times.Once);
        }

        [Test]
        public void Post_InputSomeTag_ShouldCallCreateMethodFromService()
        {
            var testRole = new Tag()
            {
                Id = Guid.NewGuid(),
                Name = "testTag",
            };

            _tagsController.Post(testRole);

            _tagService.Verify(m => m.Create(testRole), Times.Once);
        }
    }
}
