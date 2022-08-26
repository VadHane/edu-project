using Microsoft.AspNetCore.Http;
using API.Models;

namespace API.Interfaces
{
    public interface IFileService
    {
        string SaveFile(IFormFile file, FileTypeEnum fileType);

        void DeleteFile(string absolutePath);
    }
}
