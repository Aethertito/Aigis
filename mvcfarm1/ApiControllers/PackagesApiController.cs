using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using mvcfarm1.Services;
using mvcfarm1.Models;

namespace mvcfarm1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackagesApiController : ControllerBase
    {
        private readonly IPackageService _packageService;

        public PackagesApiController(IPackageService packageService)
        {
            _packageService = packageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Package>>> GetPackages()
        {
            var packages = await _packageService.GetAllPackagesAsync();
            return Ok(packages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Package>> GetPackage(int id)
        {
            var package = await _packageService.GetPackageByIdAsync(id);
            if (package == null)
            {
                return NotFound();
            }

            return package;
        }

        [HttpPost]
        public async Task<ActionResult<Package>> PostPackage(Package package)
        {
            var createdPackage = await _packageService.CreatePackageAsync(package);
            return CreatedAtAction(nameof(GetPackage), new { id = createdPackage.Id }, createdPackage);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPackage(int id, Package package)
        {
            if (id != package.Id)
            {
                return BadRequest();
            }

            await _packageService.UpdatePackageAsync(package);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackage(int id)
        {
            await _packageService.DeletePackageAsync(id);
            return NoContent();
        }
    }
}
