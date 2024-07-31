using Microsoft.AspNetCore.Mvc;
using mvcfarm1.Services;
using mvcfarm1.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace mvcfarm1.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackagesApiController : ControllerBase
    {
        private readonly PackageService _packageService;

        public PackagesApiController(PackageService packageService)
        {
            _packageService = packageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Package>>> GetPackages()
        {
            var packages = await _packageService.GetAllPackagesAsync();
            return Ok(packages);
        }
    }
}
