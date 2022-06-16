using System;
using NUnit.Framework;
using Moq;
using Lab2.Models;
using Lab2.Services;
using Lab2.Controllers;
using System.Collections.Generic;

namespace Lab2.Test.ControlerTests
{
    class UsersControllerTest
    {

        private Mock<IUserService> service;
        private UsersController controller;

        [SetUp]
        public void Setup()
        {
            service = new Mock<IUserService>();
            controller = new UsersController(service.Object);
        }

        [Test]
        public void Get_InputNothing_ShouldCallReadAllMethodFromService()
        {
            controller.Get();

            service.Verify(m => m.ReadAll(), Times.Once);
        }

        [Test]
        public void Get_InputUserId_ShouldCallReadOneMethodFromService()
        {
            var testUserId = Guid.NewGuid();

            controller.Get(testUserId);

            service.Verify(m => m.ReadOne(testUserId), Times.Once);
        }

        [Test]
        public void Create_InputUser_ShouldCallCreateMethodFromService()
        {
            var testUserCreateUpdateRequest = new UserCreateUpdateRequest()
            {
                FirstName = "testName",
                LastName = "testSurname",
                Email = "testEmail@test.ts",
                Roles = ""
            };

            controller.Post(testUserCreateUpdateRequest);

            service.Verify(m => m.Create(It.IsAny<User>(), null), Times.Once);
        }

        [Test]
        public void Update_InputUserIdAndUser_ShouldCallUpdateMethodFromService()
        {
            var testUserCreateUpdateRequest = new UserCreateUpdateRequest()
            {
                FirstName = "testName",
                LastName = "testSurname",
                Email = "testEmail@test.ts",
                Roles = ""
            };
            var userId = Guid.NewGuid();

            controller.Put(userId, testUserCreateUpdateRequest);

            service.Verify(m => m.Update(It.IsAny<Guid>(), It.IsAny<User>(), null), Times.Once);
        }

        [Test]
        public void Delete_InputUserId_ShouldCallDeleteMethodFromService()
        {
            var testUserId = Guid.NewGuid();

            controller.Delete(testUserId);

            service.Verify(m => m.Delete(testUserId), Times.Once);
        }
    }
}
