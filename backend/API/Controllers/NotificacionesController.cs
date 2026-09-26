using Application.Features.Notificaciones.Commands.CreateNotificacion;
using Application.Features.Notificaciones.Commands.DeleteNotificacion;
using Application.Features.Notificaciones.Commands.UpdateNotificacion;
using Application.Features.Notificaciones.Dtos;
using Application.Features.Notificaciones.Queries.GetAllNotificaciones;
using Application.Features.Notificaciones.Queries.GetNotificacionById;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class NotificacionesController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public NotificacionesController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Notificaciones/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(NotificacionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<NotificacionDto>> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var notificacion = await _bus.InvokeAsync<NotificacionDto>(new GetNotificacionByIdQuery() { Id = id }, cancellationToken);
                return Ok(notificacion);
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

        // GET api/v1/Notificaciones?categoriaId=&tagId=
        [HttpGet]
        [ProducesResponseType(typeof(List<NotificacionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<NotificacionDto>>> GetAll([FromQuery] Guid? categoriaId, [FromQuery] Guid? tagId, CancellationToken cancellationToken)
        {
            try
            {
                var notificaciones = await _bus.InvokeAsync<List<NotificacionDto>>(new GetAllNotificacionesQuery { CategoriaId = categoriaId, TagId = tagId }, cancellationToken);
                return Ok(notificaciones);
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

        // POST api/v1/Notificaciones
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(NotificacionDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<NotificacionDto>> Post([FromBody] CreateNotificacionCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var notificacion = await _bus.InvokeAsync<NotificacionDto>(command, cancellationToken);
                return CreatedAtAction(nameof(Get), new { id = notificacion.Id }, notificacion);
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

        // DELETE api/v1/Notificaciones/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                // Los handlers sin respuesta (Update/Delete) se invocan sin tipo genérico.
                await _bus.InvokeAsync(new DeleteNotificacionCommand() { Id = id }, cancellationToken);
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

        // PUT api/v1/Notificaciones/id
        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateNotificacionCommand command, CancellationToken cancellationToken)
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
