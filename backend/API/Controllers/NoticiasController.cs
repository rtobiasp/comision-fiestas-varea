using Application.Features.Noticias.Commands.CreateNoticia;
using Application.Features.Noticias.Commands.DeleteNoticia;
using Application.Features.Noticias.Commands.UpdateNoticia;
using Application.Features.Noticias.Queries.GetAllNoticias;
using Application.Features.Noticias.Queries.GetNoticiaById;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class NoticiasController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public NoticiasController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Noticias/id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var noticia = await _bus.InvokeAsync<Domain.Entities.Noticia>(new GetNoticiaByIdQuery() { Id = id }, cancellationToken);
                return Ok(noticia);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/Noticias
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            try
            {
                var noticias = await _bus.InvokeAsync<List<Domain.Entities.Noticia>>(new GetAllNoticiasQuery(), cancellationToken);
                return Ok(noticias);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/v1/Noticias
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateNoticiaCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var noticia = await _bus.InvokeAsync<Domain.Entities.Noticia>(command, cancellationToken);
                return CreatedAtAction(nameof(Get), new { id = noticia.Id }, noticia);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Errors);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/v1/Noticias/id
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                // Los handlers sin respuesta (Update/Delete) se invocan sin tipo genérico.
                await _bus.InvokeAsync(new DeleteNoticiaCommand() { Id = id }, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/v1/Noticias/id
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateNoticiaCommand command, CancellationToken cancellationToken)
        {
            try
            {
                command.Id = id;
                await _bus.InvokeAsync(command, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
