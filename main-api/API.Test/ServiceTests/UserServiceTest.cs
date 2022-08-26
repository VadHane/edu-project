using System;
using System.Linq;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using API.Exceptions;
using API.Models;
using API.Services;
using API.Interfaces;

namespace API.Test.ServiceTests
{
    public class UserServiceTest
    {
        private IUserService _userService;
        private Mock<IFileService> _fileService;
        private UserContext _DBContext;

        [SetUp]
        public void Setup()
        {
            var optionts = new DbContextOptionsBuilder<UserContext>()
                .UseInMemoryDatabase("Test DB")
                .Options;

            var env = new Mock<IWebHostEnvironment>();
            var envWebRootPath = "testWebPath";

            env.Setup(m => m.WebRootPath).Returns(envWebRootPath);

            _fileService = new Mock<IFileService>();

            _DBContext = new UserContext(optionts);
            _userService = new UserService(_DBContext, env.Object, _fileService.Object);
        }
        
        private async Task ClearTestDataBase()
        {
            var userList = await _DBContext.Users.ToArrayAsync();

            foreach (var user in userList)
            {
                _DBContext.Users.Remove(user);
            }
            _DBContext.SaveChanges();
        }

        private User AddUserIntoTestDB(User user = null)
        {
            if (user == null)
            {
                user = new User()
                {
                    Id = Guid.NewGuid(),
                    FirstName = "TestName",
                    LastName = "TestSurname",
                    Email = "testEmail@test.ts",
                    ImageBlobKey = null,
                };
            }

            var createdEntity = _DBContext.Users.Add(user);
            _DBContext.SaveChanges();

            return createdEntity.Entity;
        }

        [Test]
        public async Task ReadAll_InputEmptyDB_ShouldThrowException()
        {
            await ClearTestDataBase();

            Assert.Catch<DatabaseIsEmptyException>(() => _userService.ReadAll());
        }

        [Test]
        public void ReadAll_InputNotEmptyDB_ShouldReturnAllUsersFromDB()
        {
            AddUserIntoTestDB();

            var expectedUserList = _DBContext.Users.ToArrayAsync().Result;

            var foundUserList = _userService.ReadAll().ToList();

            Assert.AreEqual(expectedUserList.Length, foundUserList.Count);
        }

        [Test]
        public async Task ReadOne_InputEmptyDB_ShouldThrowException()
        {
            var randomUserId = Guid.NewGuid();

            await ClearTestDataBase();

            Assert.Catch<DatabaseIsEmptyException>(() => _userService.ReadOne(randomUserId));
        }

        [Test]
        public void ReadOne_InputIncorrectUserId_ShouldThrowException()
        {
            var randomUserId = Guid.NewGuid();

            AddUserIntoTestDB();

            Assert.Catch<EntityNotFoundException>(() => _userService.ReadOne(randomUserId));
        }

        [Test]
        public void ReadOne_InputAvailableUserId_ShouldReturnUserFromDBById()
        {
            var createdTestEntity = AddUserIntoTestDB();

            if (createdTestEntity == null)
            {
                Assert.Fail("Created test entity is null.");
            }

            var foundUser = _userService.ReadOne(createdTestEntity.Id);

            Assert.AreEqual(createdTestEntity.Id, foundUser.Id);
        }

        [Test]
        public void Create_InputUserWithoutFile_ShouldReturnUserEntityWithoutErrors()
        {
            IFormFile testFile = null;
            var testUser = new User()
            {
                Id = Guid.NewGuid(),
                FirstName = "TestName",
                LastName = "TestSurname",
                Email = "testEmail@test.ts",
                ImageBlobKey = "test",
                Password = "password",
            };

            var createdUserEntity = _userService.Create(testUser, testFile);

            Assert.AreEqual(createdUserEntity.Email, testUser.Email);
            Assert.DoesNotThrow(() => _DBContext.Users.Find(createdUserEntity.Id));
        }

        [Test]
        public void Update_InputUserIdWithoutFile_ShouldUpdateUserInDB()
        {
            IFormFile testFile = null;
            var createdUser = AddUserIntoTestDB();
            var update = new User()
            {
                Id = createdUser.Id,
                FirstName = "TestName",
                LastName = "TestSurname",
                Email = "testUpdateEmail@test.ts",
                ImageBlobKey = "test",
                Password = "password",
            };

            var updatedUser = _userService.Update(createdUser.Id, update, testFile);

            Assert.AreEqual(update.Email, updatedUser.Email);
        }

        [Test]
        public void Update_InputIncorrectUserId_ShouldThrowException()
        {
            var randomUserId = Guid.NewGuid();
            var emptyUser = new User();
            var contentOfTestFile = "It is test file.";
            var bytesOfFile = Encoding.UTF8.GetBytes(contentOfTestFile);
            var emptyFile = new Mock<FormFile>(
                new MemoryStream(bytesOfFile),
                0,
                bytesOfFile.Length,
                "File",
                "testFile.txt"
            ).Object;

            Assert.Catch<EntityNotFoundException>(() => _userService.Update(randomUserId, emptyUser, emptyFile));
        }

        [Test]
        public void Delete_InputIncorrectUserId_ShouldThrowException()
        {
            var randomUserId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => _userService.Delete(randomUserId));
        }

        [Test]
        public void Delete_InputAvailableUserId_ShouldDeleteUser()
        {
            var createdUser = AddUserIntoTestDB();

            _userService.Delete(createdUser.Id);

            Assert.Catch<EntityNotFoundException>(() => _userService.Delete(createdUser.Id));
        }
    }
}