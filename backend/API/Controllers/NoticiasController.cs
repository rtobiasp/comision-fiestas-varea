using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticiasController : ControllerBase
    {
        private readonly INoticiaRepository _noticiaRepository;

        public NoticiasController(INoticiaRepository noticiaRepository)
        {
            _noticiaRepository = noticiaRepository;
        }

        // GET: api/Noticias/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Noticia>> Get(Guid id)
        {
            var noticia = await _noticiaRepository.GetAsync(id);
            return Ok(noticia);
        }

        // GET api/Noticias
        [HttpGet]
        public async Task<ActionResult<List<Noticia>>> GetAll()
        {
            var noticias = await _noticiaRepository.GetAllAsync();
            return Ok(noticias);
        }

        [HttpPost]
        public async Task<ActionResult<Noticia>> Post([FromBody] Noticia noticia)
        {
            await _noticiaRepository.AddAsync(noticia);
            return CreatedAtAction(nameof(Get), new { id = noticia.Id }, noticia);
        }

    }
}
