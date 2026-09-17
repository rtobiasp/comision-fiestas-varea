using Application.Common.Interfaces;
using Application.Features.Noticias.Commands.CreateNoticia;
using Domain.Entities;
using Infrastructure.Repositories;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class NoticiasController : ControllerBase
    {
        private readonly INoticiaRepository _noticiaRepository;
        private readonly IMediator _mediator;

        public NoticiasController(INoticiaRepository noticiaRepository, IMediator mediator)
        {
            _noticiaRepository = noticiaRepository;
            _mediator = mediator;
        }

        // GET: api/Noticias/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Noticia>> Get(string id)
        {
            try
            {
                var noticia = await _noticiaRepository.GetAsync(id);
                return Ok(noticia);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/Noticias
        [HttpGet]
        public async Task<ActionResult<List<Noticia>>> GetAll()
        {
            try
            {
                var noticias = await _noticiaRepository.GetAllAsync();
                return Ok(noticias);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/Noticias
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateNoticiaCommand command)
        {
            try
            {
                var noticia = await _mediator.Send(command);
                return Ok(noticia);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/Noticias/id
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                await _noticiaRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/Noticias
        [HttpPut]
        public async Task<ActionResult> Put([FromBody] Noticia noticia)
        {
            try
            {
                await _noticiaRepository.UpdateAsync(noticia);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
