using System;
using NUnit.Framework;
using Moq;
using Lab3.Models;
using Lab3.Services;
using Lab3.Controllers;

namespace Lab3.Test.ControlerTests
{
    class RolesControllerTest
    {
        private Mock<IRoleService> _roleService;
        private RolesController _roleController;

        [SetUp]
        public void Setup()
        {
            _roleService = new Mock<IRoleService>();
            _roleController = new RolesController(_roleService.Object);
        }

        [Test]
        public void Get_InputNothing_ShouldCallReadAllMethodFromService()
        {
            _roleController.Get();

            _roleService.Verify(m => m.ReadAll(), Times.Once);
        }

        [Test]
        public void Get_InputSomeRoleId_ShouldCallReadOneMethodFromService()
        {
            var testRoleId = Guid.NewGuid();

            _roleController.Get(testRoleId);

            _roleService.Verify(m => m.ReadOne(testRoleId), Times.Once);
        }

        [Test]
        public void Post_InputSomeRole_ShouldCallCreateMethodFromService()
        {
            var testRole = new Role()
            {
                Id = Guid.NewGuid(),
                Name = "testRole",
            };

            _roleController.Post(testRole);

            _roleService.Verify(m => m.Create(testRole), Times.Once);
        }
    }
}
