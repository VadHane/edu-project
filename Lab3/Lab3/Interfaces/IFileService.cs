using Microsoft.AspNetCore.Http;
using Lab3.Models;

namespace Lab3.Interfaces
{
    public interface IFileService
    {
        string SaveFile(IFormFile file, FileTypeEnum fileType);

        void DeleteFile(string absolutePath);
    }
}
