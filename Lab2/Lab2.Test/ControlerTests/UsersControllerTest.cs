using System;
using Moq;
using NUnit.Framework;
using Lab2.Models;
using Lab2.Services;
using Lab2.Controllers;

namespace Lab2.Test.ControlerTests
{
    class UsersControllerTest
    {

        private Mock<IUserService> _userService;
        private UsersController _userController;

        [SetUp]
        public void Setup()
        {
            _userService = new Mock<IUserService>();
            _userController = new UsersController(_userService.Object);
        }

        [Test]
        public void Get_InputNothing_ShouldCallReadAllMethodFromService()
        {
            _userController.Get();

            _userService.Verify(m => m.ReadAll(), Times.Once);
        }

        [Test]
        public void Get_InputUserId_ShouldCallReadOneMethodFromService()
        {
            var testUserId = Guid.NewGuid();

            _userController.Get(testUserId);

            _userService.Verify(m => m.ReadOne(testUserId), Times.Once);
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

            _userController.Post(testUserCreateUpdateRequest);

            _userService.Verify(m => m.Create(It.IsAny<User>(), null), Times.Once);
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

            _userController.Put(userId, testUserCreateUpdateRequest);

            _userService.Verify(m => m.Update(It.IsAny<Guid>(), It.IsAny<User>(), null), Times.Once);
        }

        [Test]
        public void Delete_InputUserId_ShouldCallDeleteMethodFromService()
        {
            var testUserId = Guid.NewGuid();

            _userController.Delete(testUserId);

            _userService.Verify(m => m.Delete(testUserId), Times.Once);
        }
    }
}
