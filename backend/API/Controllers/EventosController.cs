using Application.Features.Eventos.Commands.CreateEvento;
using Application.Features.Eventos.Commands.DeleteEvento;
using Application.Features.Eventos.Commands.UpdateEvento;
using Application.Features.Eventos.Dtos;
using Application.Features.Eventos.Queries.GetAllEventos;
using Application.Features.Eventos.Queries.GetEventoById;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class EventosController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public EventosController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Eventos/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(EventoDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<EventoDto>> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var evento = await _bus.InvokeAsync<EventoDto>(new GetEventoByIdQuery() { Id = id }, cancellationToken);
                return Ok(evento);
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

        // GET api/v1/Eventos?categoriaId=&tagId=&offset=&limit=&orderBy=&direction=&publicada=
        [HttpGet]
        [ProducesResponseType(typeof(List<EventoDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<EventoDto>>> GetAll([FromQuery] Guid? categoriaId, [FromQuery] Guid? tagId, [FromQuery] int? offset, [FromQuery] int? limit, [FromQuery] string? orderBy, [FromQuery] string? direction, [FromQuery] bool? publicada, CancellationToken cancellationToken)
        {
            try
            {
                var eventos = await _bus.InvokeAsync<List<EventoDto>>(new GetAllEventosQuery { CategoriaId = categoriaId, TagId = tagId, Offset = offset, Limit = limit, OrderBy = orderBy, Direction = direction, Publicada = publicada }, cancellationToken);
                return Ok(eventos);
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

        // POST api/v1/Eventos
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(EventoDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<EventoDto>> Post([FromBody] CreateEventoCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var evento = await _bus.InvokeAsync<EventoDto>(command, cancellationToken);
                return CreatedAtAction(nameof(Get), new { id = evento.Id }, evento);
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

        // DELETE api/v1/Eventos/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                await _bus.InvokeAsync(new DeleteEventoCommand() { Id = id }, cancellationToken);
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

        // PUT api/v1/Eventos/id
        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateEventoCommand command, CancellationToken cancellationToken)
        {
            try
            {
                command.Id = id;
                await _bus.InvokeAsync(command, cancellationToken);
                return NoContent();
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
    }
}
