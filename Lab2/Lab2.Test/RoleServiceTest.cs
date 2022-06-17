using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Lab2.Exceptions;
using Lab2.Models;
using Lab2.Services;

namespace Lab2.Test
{
    public class RoleServiceTest
    {
        private RoleService _roleService;
        private UserContext _DBContext;

        [SetUp]
        public void Setup()
        {
            var optionts = new DbContextOptionsBuilder<UserContext>()
                .UseInMemoryDatabase("Test DB")
                .Options;

            _DBContext = new UserContext(optionts);
            _roleService = new RoleService(_DBContext);
        }

        [Test]
        public async Task Create_InputInstanceOfRole_ShouldCreateDBEntityAndSave()
        {
            var testRole = new Role() { Name = "testRole1" };
            var numberOfRowsDBBefore = await _DBContext.Roles.CountAsync();

            var createdEntity = _roleService.Create(testRole);

            var numberOfRowsDBAfter = await _DBContext.Roles.CountAsync();
            var foundRole = await _DBContext.Roles.FindAsync(createdEntity.Id);

            Assert.AreEqual(numberOfRowsDBAfter, numberOfRowsDBBefore + 1);
            Assert.NotNull(foundRole);
        }

        [Test]
        public async Task ReadOne_InputAvailableRoleId_ShouldReturnRoleEntity()
        {
            var testRole = new Role() { Name = "testRole2", Id = Guid.NewGuid() };
            var createdTestEntity = await _DBContext.Roles.AddAsync(testRole);

            _DBContext.SaveChanges();

            if (createdTestEntity == null)
            {
                Assert.Fail("Created test entity is null.");
            }

            var foundRole = _roleService.ReadOne(createdTestEntity.Entity.Id);

            Assert.AreEqual(createdTestEntity.Entity.Id, foundRole.Id);
        }

        [Test]
        public void ReadOne_InputIncorrectRoleId_ShouldThrowException()
        {
            var randomRoleId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => _roleService.ReadOne(randomRoleId));
        }

        [Test]
        public void ReadAll_InputNotEmptyDB_ShouldReturnAllRoleFromDB()
        {
            var expectedRoleList = _DBContext.Roles.ToArrayAsync().Result;

            var foundRoleList = _roleService.ReadAll().ToList();

            Assert.AreEqual(expectedRoleList.Length, foundRoleList.Count);
        }

        [Test]
        public void ReadOneAndReadAll_InputEmptyDB_ShouldThrowException()
        {
            var roleList = _DBContext.Roles.ToArrayAsync().Result;

            foreach (var role in roleList)
            {
                _DBContext.Roles.Remove(role);
            }

            _DBContext.SaveChanges();

            var randomRoleId = Guid.NewGuid();

            Assert.Catch<DatabaseIsEmptyException>(() => _roleService.ReadOne(randomRoleId));
            Assert.Catch<DatabaseIsEmptyException>(() => _roleService.ReadAll());
        }
    }
}