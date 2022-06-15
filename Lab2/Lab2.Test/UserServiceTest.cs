using Lab2.Exceptions;
using Lab2.Models;
using Lab2.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace Lab2.Test
{
    public class UserServiceTest
    {
        private UserService service;
        private UserContext context;

        [SetUp]
        public void Setup()
        {
            var optionts = new DbContextOptionsBuilder<UserContext>()
                .UseInMemoryDatabase("Test DB")
                .Options;

            var env = new Mock<IWebHostEnvironment>();
            var envWebRootPath = "testWebPath";

            env.Setup(m => m.WebRootPath).Returns(envWebRootPath);

            context = new UserContext(optionts);
            service = new UserService(context, env.Object);
        }
        
        private void ClearTestDataBase()
        {
            var userList = context.Users.ToArrayAsync().Result;

            foreach (var user in userList)
            {
                context.Users.Remove(user);
            }
            context.SaveChanges();
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

            var createdEntity = context.Users.Add(user);
            context.SaveChanges();

            return createdEntity.Entity;
        }

        [Test]
        public void ReadAll_InputEmptyDB_ShouldThrowException()
        {
            ClearTestDataBase();

            Assert.Catch<DatabaseIsEmptyException>(() => service.ReadAll());
        }

        [Test]
        public void ReadAll_InputNotEmptyDB_ShouldReturnAllUsersFromDB()
        {
            AddUserIntoTestDB();
            var expectedUserList = context.Users.ToArrayAsync().Result;

            var foundUserList = service.ReadAll();

            Assert.AreEqual(expectedUserList.Length, foundUserList.Length);
        }

        [Test]
        public void ReadOne_InputEmptyDB_ShouldThrowException()
        {
            var randomUserId = Guid.NewGuid();

            ClearTestDataBase();

            Assert.Catch<DatabaseIsEmptyException>(() => service.ReadOne(randomUserId));
        }

        [Test]
        public void ReadOne_InputIncorrectUserId_ShouldThrowException()
        {
            var randomUserId = Guid.NewGuid();

            AddUserIntoTestDB();

            Assert.Catch<EntityNotFoundException>(() => service.ReadOne(randomUserId));
        }

        [Test]
        public void ReadOne_InputAvailableUserId_ShouldThrowException()
        {
            var createdTestEntity = AddUserIntoTestDB();

            if (createdTestEntity == null)
            {
                Assert.Fail("Created test entity is null.");
            }

            var foundUser = service.ReadOne(createdTestEntity.Id);

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
            };

            var createdUserEntity = service.Create(testUser, testFile);


            Assert.AreEqual(createdUserEntity.Email, testUser.Email);
            Assert.DoesNotThrow(() => context.Users.Find(createdUserEntity.Id));
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
            };

            var updatedUser = service.Update(createdUser.Id, update, testFile);

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

            Assert.Catch<EntityNotFoundException>(() => service.Update(randomUserId, emptyUser, emptyFile));
        }

        [Test]
        public void Delete_InputIncorrectUserId_ShouldThrowException()
        {
            var randomUserId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => service.Delete(randomUserId));
        }

        [Test]
        public void Delete_InputAvailableUserId_ShouldDeleteUser()
        {
            var createdUser = AddUserIntoTestDB();

            service.Delete(createdUser.Id);

            Assert.Catch<EntityNotFoundException>(() => service.Delete(createdUser.Id));
        }
    }
}