using Application.Features.Programaciones.Commands.CreateProgramacion;
using Application.Features.Programaciones.Commands.DeleteProgramacion;
using Application.Features.Programaciones.Commands.UpdateProgramacion;
using Application.Features.Programaciones.Dtos;
using Application.Features.Programaciones.Queries.GetAllProgramaciones;
using Application.Features.Programaciones.Queries.GetProgramacionById;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class ProgramacionesController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public ProgramacionesController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Programaciones/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ProgramacionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ProgramacionDto>> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var programacion = await _bus.InvokeAsync<ProgramacionDto>(new GetProgramacionByIdQuery() { Id = id }, cancellationToken);
                return Ok(programacion);
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

        // GET api/v1/Programaciones?offset=&limit=&orderBy=&direction=
        [HttpGet]
        [ProducesResponseType(typeof(List<ProgramacionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ProgramacionDto>>> GetAll([FromQuery] int? offset, [FromQuery] int? limit, [FromQuery] string? orderBy, [FromQuery] string? direction, CancellationToken cancellationToken)
        {
            try
            {
                var programaciones = await _bus.InvokeAsync<List<ProgramacionDto>>(new GetAllProgramacionesQuery { Offset = offset, Limit = limit, OrderBy = orderBy, Direction = direction }, cancellationToken);
                return Ok(programaciones);
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

        // POST api/v1/Programaciones
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(ProgramacionDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProgramacionDto>> Post([FromBody] CreateProgramacionCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var programacion = await _bus.InvokeAsync<ProgramacionDto>(command, cancellationToken);
                return CreatedAtAction(nameof(Get), new { id = programacion.Id }, programacion);
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

        // DELETE api/v1/Programaciones/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                await _bus.InvokeAsync(new DeleteProgramacionCommand() { Id = id }, cancellationToken);
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

        // PUT api/v1/Programaciones/id
        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateProgramacionCommand command, CancellationToken cancellationToken)
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
