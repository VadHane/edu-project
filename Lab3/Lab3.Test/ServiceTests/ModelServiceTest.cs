using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Lab3.Exceptions;
using Lab3.Models;
using Lab3.Services;
using Moq;
using Microsoft.AspNetCore.Hosting;
using Lab3.Interfaces;

namespace Lab3.Test.ServiceTests
{
    class ModelServiceTest
    {
        private ModelService _modelService;
        private Mock<IFileService> _fileService;
        private ModelContext _DBContext;

        [SetUp]
        public void Setup()
        {
            var optionts = new DbContextOptionsBuilder<ModelContext>()
                .UseInMemoryDatabase("Test DB")
                .Options;

            var env = new Mock<IWebHostEnvironment>();
            var envWebRootPath = "testWebPath";

            env.Setup(m => m.WebRootPath).Returns(envWebRootPath);

            _fileService = new Mock<IFileService>();

            _DBContext = new ModelContext(optionts);
            _modelService = new ModelService(_DBContext, env.Object, _fileService.Object);
        }

        private async Task ClearTestDataBase()
        {
            var userList = await _DBContext.Models.ToArrayAsync();

            foreach (var user in userList)
            {
                _DBContext.Models.Remove(user);
            }
            _DBContext.SaveChanges();
        }

        private Model AddModelIntoTestDB(Model model = null)
        {
            if (model == null)
            {
                model = new Model()
                {
                    Id = Guid.NewGuid(),
                    Name = "TestName",
                    Description = "TestDescription",
                    Filekey = null,
                    PrevBlobKey = null,
                    CreatedAt = DateTime.Now,
                    CreatedBy = Guid.NewGuid(),
                    UpdatedAt = DateTime.Now,
                    UpdatedBy = Guid.NewGuid(),
                };
            }

            var createdEntity = _DBContext.Models.Add(model);
            _DBContext.SaveChanges();

            return createdEntity.Entity;
        }

        [Test]
        public async Task ReadAll_InputEmptyDB_ShouldReturnEmptyList()
        {
            await ClearTestDataBase();

            var expectedLengthList = 0;
            var returnedLengthList = _modelService.ReadAll().ToList().Count;

            Assert.AreEqual(expectedLengthList, returnedLengthList);
        }

        [Test]
        public void ReadAll_InputNotEmptyDB_ShouldReturnAllModelsFromDB()
        {
            AddModelIntoTestDB();

            var expectedList = _DBContext.Models.ToList();

            var foundList = _modelService.ReadAll().ToList();

            Assert.AreEqual(expectedList.Count, foundList.Count);
        }

        [Test]
        public async Task ReadOne_InputEmptyDB_ShouldThrowException()
        {
            var randomId = Guid.NewGuid();

            await ClearTestDataBase();

            Assert.Catch<EntityNotFoundException>(() => _modelService.ReadOne(randomId));
        }

        [Test]
        public void ReadOne_InputIncorrectModelId_ShouldThrowException()
        {
            var randomId = Guid.NewGuid();

            AddModelIntoTestDB();

            Assert.Catch<EntityNotFoundException>(() => _modelService.ReadOne(randomId));
        }

        [Test]
        public void ReadOne_InputAvailableModelId_ShouldReturnModelFromDBById()
        {
            var createdTestEntity = AddModelIntoTestDB();

            if (createdTestEntity == null)
            {
                Assert.Fail("Created test entity is null.");
            }

            var foundEntity = _modelService.ReadOne(createdTestEntity.Id);

            Assert.AreEqual(createdTestEntity.Id, foundEntity.Id);
        }

        [Test]
        public void Create_InputModelWithoutFiles_ShouldCreateNewModelEntity()
        {
            var testModel = new Model()
            {
                Name = "TestName",
                Description = "TestDescription",
                Filekey = null,
                PrevBlobKey = null,
                CreatedAt = DateTime.Now,
                CreatedBy = Guid.NewGuid(),
                UpdatedAt = DateTime.Now,
                UpdatedBy = Guid.NewGuid(),
            };

            var createdEntity = _modelService.Create(testModel, null, null);
            var foundEntity = _DBContext.Models.Where(model => model.Id == createdEntity.Id).First();

            Assert.NotNull(createdEntity);
            Assert.NotNull(foundEntity);
            Assert.Null(foundEntity.Filekey);
        }

        [Test]
        public void Create_InputModelWithoutFiles_ShouldCreateNewModelHistoryRow()
        {
            var testModel = new Model()
            {
                Name = "TestName",
                Description = "TestDescription",
                Filekey = null,
                PrevBlobKey = null,
                CreatedAt = DateTime.Now,
                CreatedBy = Guid.NewGuid(),
                UpdatedAt = DateTime.Now,
                UpdatedBy = Guid.NewGuid(),
            };

            var createdEntity = _modelService.Create(testModel, null, null);
            var foundHistory = _DBContext.ModelHistories.Where(h => h.ModelId == createdEntity.Id).ToList();

            Assert.NotNull(foundHistory.First());
        }

        [Test]
        public void Update_InputIncorrectId_ShouldThrowException()
        {
            var randomId = Guid.NewGuid();
            var updateModel = new Model()
            {
                Name = "UpdatedName",
                Description = "TestDescription",
                Filekey = null,
                PrevBlobKey = null,
                CreatedAt = DateTime.Now,
                CreatedBy = Guid.NewGuid(),
                UpdatedAt = DateTime.Now,
                UpdatedBy = Guid.NewGuid(),
            };

            Assert.Catch<EntityNotFoundException>(() => _modelService.Update(randomId, updateModel, null, null));
        }

        [Test]
        public void Delete_InputIncorrectModelId_ShouldTrowException()
        {
            var randomId = Guid.NewGuid();

            Assert.Catch<EntityNotFoundException>(() => _modelService.Delete(randomId));
        }
    }
}
