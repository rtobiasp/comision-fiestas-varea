using Application.Features.Programaciones.Commands.CreateEventoProgramacion;
using Application.Features.Programaciones.Commands.DeleteEventoProgramacion;
using Application.Features.Programaciones.Commands.UpdateEventoProgramacion;
using Application.Features.Programaciones.Dtos;
using Application.Features.Programaciones.Queries.GetEventoProgramacionById;
using Application.Features.Programaciones.Queries.GetEventosByDia;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class EventosProgramacionController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public EventosProgramacionController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/EventosProgramacion/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(EventoProgramacionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<EventoProgramacionDto>> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var evento = await _bus.InvokeAsync<EventoProgramacionDto>(new GetEventoProgramacionByIdQuery() { Id = id }, cancellationToken);
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

        // GET api/v1/EventosProgramacion?diaId=&offset=&limit=&direction=
        [HttpGet]
        [ProducesResponseType(typeof(List<EventoProgramacionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<EventoProgramacionDto>>> GetAll([FromQuery] Guid? diaId, [FromQuery] int? offset, [FromQuery] int? limit, [FromQuery] string? direction, CancellationToken cancellationToken)
        {
            try
            {
                var eventos = await _bus.InvokeAsync<List<EventoProgramacionDto>>(new GetEventosByDiaQuery { DiaId = diaId ?? Guid.Empty, Offset = offset, Limit = limit, Direction = direction }, cancellationToken);
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

        // POST api/v1/EventosProgramacion
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(EventoProgramacionDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<EventoProgramacionDto>> Post([FromBody] CreateEventoProgramacionCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var evento = await _bus.InvokeAsync<EventoProgramacionDto>(command, cancellationToken);
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

        // DELETE api/v1/EventosProgramacion/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                await _bus.InvokeAsync(new DeleteEventoProgramacionCommand() { Id = id }, cancellationToken);
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

        // PUT api/v1/EventosProgramacion/id
        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateEventoProgramacionCommand command, CancellationToken cancellationToken)
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
