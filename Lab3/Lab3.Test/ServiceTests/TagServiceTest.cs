using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Lab3.Exceptions;
using Lab3.Models;
using Lab3.Services;

namespace Lab3.Test.ServiceTests
{
    class TagServiceTest
    {
        private TagService _tagService;
        private ModelContext _DBContext;
        
        [SetUp]
        public void Setup()
        {
            var optionts = new DbContextOptionsBuilder<ModelContext>()
                .UseInMemoryDatabase("Test DB")
                .Options;

            _DBContext = new ModelContext(optionts);
            _tagService = new TagService(_DBContext);
        }

        [Test]
        public async Task Create_InputInstanceOfTag_ShouldCreateDBEntityAndSave()
        {
            var testTag = new Tag() { Name = "TestTag" };
            var numberOfRowsDBBefore = await _DBContext.Tags.CountAsync();

            var createdEntity = _tagService.Create(testTag);

            var numberOfRowsDBAfter = await _DBContext.Tags.CountAsync();
            var foundRole = await _DBContext.Tags.FindAsync(createdEntity.Id);

            Assert.AreEqual(numberOfRowsDBBefore + 1, numberOfRowsDBAfter);
            Assert.NotNull(foundRole);
        }

        [Test]
        public async Task ReadOne_InputAvailableRoleId_ShouldReturnTagEntity()
        {
            var testTag = new Tag() { Name = "TestTag", Id = Guid.NewGuid() };
            var createdTestEntity = await _DBContext.Tags.AddAsync(testTag);

            _DBContext.SaveChanges();

            if (createdTestEntity == null)
            {
                Assert.Fail("Created test entity is null.");
            }

            var foundTag = _tagService.ReadOne(createdTestEntity.Entity.Id);

            Assert.AreEqual(createdTestEntity.Entity.Id, foundTag.Id);
        }

        [Test]
        public void ReadOne_InputIncorrectTagId_ShouldThrowException()
        {
            var randomTagId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => _tagService.ReadOne(randomTagId));
        }

        [Test]
        public void ReadAll_InputNotEmptyDB_ShouldReturnAllTagsFromDB()
        {
            var expectedList = _DBContext.Tags.ToList();

            var foundList = _tagService.ReadAll().ToList();

            Assert.AreEqual(expectedList.Count, foundList.Count);
        }

        [Test]
        public void ReadAll_InputEmptyDB_ShouldReturnEmptyList()
        {
            var tagList = _DBContext.Tags.ToList();

            foreach (var tag in tagList)
            {
                _DBContext.Tags.Remove(tag);
            }

            _DBContext.SaveChanges();

            var expectedListLength = 0;
            var returnedListLength = _tagService.ReadAll().ToList().Count;

            Assert.AreEqual(expectedListLength, returnedListLength);
        }

        [Test]
        public void ReadOne_InputEmptyDB_ShouldThrowException()
        {
            var tagList = _DBContext.Tags.ToList();

            foreach (var tag in tagList)
            {
                _DBContext.Tags.Remove(tag);
            }

            _DBContext.SaveChanges();

            var randomTagId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => _tagService.ReadOne(randomTagId));
        }
    }
}
