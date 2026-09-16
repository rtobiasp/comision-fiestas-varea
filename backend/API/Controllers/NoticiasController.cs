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

        // GET: api/<NoticiasController>
        [HttpGet("{id}")]
        public Task<Noticia> Get(Guid id)
        {
            return _noticiaRepository.GetAsync(id);
        }

        // GET api/<NoticiasController>
        [HttpGet]
        public async Task<ActionResult<List<Noticia>>> GetAll()
        {
            var noticias = await _noticiaRepository.GetAllAsync();
            return Ok(noticias);
        }

    }
}
