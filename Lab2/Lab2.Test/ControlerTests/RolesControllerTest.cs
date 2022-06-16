using System;
using NUnit.Framework;
using Moq;
using Lab2.Models;
using Lab2.Services;
using Lab2.Controllers;

namespace Lab2.Test.ControlerTests
{
    class RolesControllerTest
    {
        private Mock<IRoleService> service;
        private RolesController controller;

        [SetUp]
        public void Setup()
        {
            service = new Mock<IRoleService>();
            controller = new RolesController(service.Object);
        }

        [Test]
        public void Get_InputNothing_ShouldCallReadAllMethodFromService()
        {
            controller.Get();

            service.Verify(m => m.ReadAll(), Times.Once);
        }

        [Test]
        public void Get_InputSomeRoleId_ShouldCallReadOneMethodFromService()
        {
            var testRoleId = Guid.NewGuid();

            controller.Get(testRoleId);

            service.Verify(m => m.ReadOne(testRoleId), Times.Once);
        }

        [Test]
        public void Post_InputSomeRole_ShouldCallCreateMethodFromService()
        {
            var testRole = new Role()
            {
                Id = Guid.NewGuid(),
                Name = "testRole",
            };

            controller.Post(testRole);

            service.Verify(m => m.Create(testRole), Times.Once);
        }
    }
}
