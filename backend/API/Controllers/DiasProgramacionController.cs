using Application.Features.Programaciones.Commands.CreateDiaProgramacion;
using Application.Features.Programaciones.Commands.DeleteDiaProgramacion;
using Application.Features.Programaciones.Commands.UpdateDiaProgramacion;
using Application.Features.Programaciones.Dtos;
using Application.Features.Programaciones.Queries.GetDiaProgramacionById;
using Application.Features.Programaciones.Queries.GetDiasByProgramacion;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class DiasProgramacionController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public DiasProgramacionController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/DiasProgramacion/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(DiaProgramacionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DiaProgramacionDto>> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var dia = await _bus.InvokeAsync<DiaProgramacionDto>(new GetDiaProgramacionByIdQuery() { Id = id }, cancellationToken);
                return Ok(dia);
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

        // GET api/v1/DiasProgramacion?programacionId=&offset=&limit=&direction=
        [HttpGet]
        [ProducesResponseType(typeof(List<DiaProgramacionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<DiaProgramacionDto>>> GetAll([FromQuery] Guid? programacionId, [FromQuery] int? offset, [FromQuery] int? limit, [FromQuery] string? direction, CancellationToken cancellationToken)
        {
            try
            {
                var dias = await _bus.InvokeAsync<List<DiaProgramacionDto>>(new GetDiasByProgramacionQuery { ProgramacionId = programacionId ?? Guid.Empty, Offset = offset, Limit = limit, Direction = direction }, cancellationToken);
                return Ok(dias);
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

        // POST api/v1/DiasProgramacion
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(DiaProgramacionDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DiaProgramacionDto>> Post([FromBody] CreateDiaProgramacionCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var dia = await _bus.InvokeAsync<DiaProgramacionDto>(command, cancellationToken);
                return CreatedAtAction(nameof(Get), new { id = dia.Id }, dia);
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

        // DELETE api/v1/DiasProgramacion/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                await _bus.InvokeAsync(new DeleteDiaProgramacionCommand() { Id = id }, cancellationToken);
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

        // PUT api/v1/DiasProgramacion/id
        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateDiaProgramacionCommand command, CancellationToken cancellationToken)
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
