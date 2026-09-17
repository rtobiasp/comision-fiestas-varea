using Application.Features.Noticias.Commands.CreateNoticia;
using Application.Features.Noticias.Commands.DeleteNoticia;
using Application.Features.Noticias.Commands.UpdateNoticia;
using Application.Features.Noticias.Queries.GetAllNoticias;
using Application.Features.Noticias.Queries.GetNoticiaById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class NoticiasController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NoticiasController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/v1/Noticias/id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var noticia = await _mediator.Send(new GetNoticiaByIdQuery() { Id = id }, cancellationToken);
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
                var noticias = await _mediator.Send(new GetAllNoticiasQuery(), cancellationToken);
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
                var noticia = await _mediator.Send(command, cancellationToken);
                return CreatedAtAction(nameof(Get), new { id = noticia.Id }, noticia);
            }
            catch (Exception ex)
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
                await _mediator.Send(new DeleteNoticiaCommand() { Id = id }, cancellationToken);
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
                await _mediator.Send(command, cancellationToken);
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
