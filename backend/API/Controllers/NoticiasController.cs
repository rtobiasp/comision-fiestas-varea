using Application.Features.Noticias.Commands.CreateNoticia;
using Application.Features.Noticias.Commands.DeleteNoticia;
using Application.Features.Noticias.Commands.UpdateNoticia;
using Application.Features.Noticias.Dtos;
using Application.Features.Noticias.Queries.GetAllNoticias;
using Application.Features.Noticias.Queries.GetNoticiaById;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class NoticiasController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public NoticiasController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Noticias/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(NoticiaDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<NoticiaDto>> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var noticia = await _bus.InvokeAsync<NoticiaDto>(new GetNoticiaByIdQuery() { Id = id }, cancellationToken);
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

        // GET api/Noticias?categoriaId=&tagId=&offset=&limit=
        [HttpGet]
        [ProducesResponseType(typeof(List<NoticiaDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<NoticiaDto>>> GetAll([FromQuery] Guid? categoriaId, [FromQuery] Guid? tagId, [FromQuery] int? offset, [FromQuery] int? limit, CancellationToken cancellationToken)
        {
            try
            {
                var noticias = await _bus.InvokeAsync<List<NoticiaDto>>(new GetAllNoticiasQuery { CategoriaId = categoriaId, TagId = tagId, Offset = offset, Limit = limit }, cancellationToken);
                return Ok(noticias);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Errors);
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

        // POST api/v1/Noticias
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(NoticiaDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<NoticiaDto>> Post([FromBody] CreateNoticiaCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var noticia = await _bus.InvokeAsync<NoticiaDto>(command, cancellationToken);
                return CreatedAtAction(nameof(Get), new { id = noticia.Id }, noticia);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Errors);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/v1/Noticias/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
