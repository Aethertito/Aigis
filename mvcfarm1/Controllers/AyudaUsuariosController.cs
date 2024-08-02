using mvcfarm1.Models;
using mvcfarm1.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


namespace mvcfarm1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AyudaUsuariosController : ControllerBase
    {
        private readonly AyudaUsuariosDAL _ayudaUsuariosDAL;
        private readonly ILogger<AyudaUsuariosController> _logger;

        public AyudaUsuariosController(AyudaUsuariosDAL ayudaUsuariosDAL, ILogger<AyudaUsuariosController> logger)
        {
            _ayudaUsuariosDAL = ayudaUsuariosDAL;
            _logger = logger;
        }

        [HttpPost]
        public IActionResult CreateAyudaUsuarios([FromBody] AyudaUsuarios ayudaUsuarios)
        {
            _ayudaUsuariosDAL.CreateAyudaUsuarios(ayudaUsuarios);
            return CreatedAtAction(nameof(GetAyudaUsuariosById), new { id = ayudaUsuarios.Id }, ayudaUsuarios);
        }

        [HttpGet("{id}")]
        public IActionResult GetAyudaUsuariosById(string id)
        {
            var ayudaUsuarios = _ayudaUsuariosDAL.GetAyudaUsuariosById(id);
            if (ayudaUsuarios == null)
                return NotFound();
            return Ok(ayudaUsuarios);
        }

    }
}
