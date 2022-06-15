using Lab2.Exceptions;
using Lab2.Models;
using Lab2.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Threading.Tasks;

namespace Lab2.Test
{
    public class RoleServiceTest
    {
        private RoleService service;
        private UserContext context;

        [SetUp]
        public void Setup()
        {
            var optionts = new DbContextOptionsBuilder<UserContext>()
                .UseInMemoryDatabase("Test DB")
                .Options;

            context = new UserContext(optionts);
            service = new RoleService(context);
        }

        [Test]
        public async Task Create_InputInstanceOfRole_ShouldCreateDBEntityAndSave()
        {
            var testRole = new Role() { Name = "testRole1" };
            var numberOfRowsDBBefore = await context.Roles.CountAsync();

            var createdEntity = service.Create(testRole);

            var numberOfRowsDBAfter = await context.Roles.CountAsync();
            var foundRole = await context.Roles.FindAsync(createdEntity.Id);

            Assert.AreEqual(numberOfRowsDBAfter, numberOfRowsDBBefore + 1);
            Assert.NotNull(foundRole);
        }

        [Test]
        public async Task ReadOne_InputAvailableRoleId_ShouldReturnRoleEntity()
        {
            var testRole = new Role() { Name = "testRole2", Id = Guid.NewGuid() };
            var createdTestEntity = await context.Roles.AddAsync(testRole);
            context.SaveChanges();

            if (createdTestEntity == null)
            {
                Assert.Fail("Created test entity is null.");
            }

            var foundRole = service.ReadOne(createdTestEntity.Entity.Id);

            Assert.AreEqual(createdTestEntity.Entity.Id, foundRole.Id);
        }

        [Test]
        public void ReadOne_InputIncorrectRoleId_ShouldThrowException()
        {
            var randomRoleId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => service.ReadOne(randomRoleId));
        }

        [Test]
        public void ReadAll_InputNotEmptyDB_ShouldReturnAllRoleFromDB()
        {
            var expectedRoleList = context.Roles.ToArrayAsync().Result;

            var foundRoleList = service.ReadAll();

            Assert.AreEqual(expectedRoleList.Length, foundRoleList.Length);
        }

        [Test]
        public void ReadOneAndReadAll_InputEmptyDB_ShouldThrowException()
        {
            var roleList = context.Roles.ToArrayAsync().Result;

            foreach (var role in roleList)
            {
                context.Roles.Remove(role);
            }
            context.SaveChanges();

            var randomRoleId = Guid.NewGuid();

            Assert.Catch<DatabaseIsEmptyException>(() => service.ReadOne(randomRoleId));
            Assert.Catch<DatabaseIsEmptyException>(() => service.ReadAll());
        }
    }
}