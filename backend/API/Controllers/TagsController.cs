using Application.Features.Tags.Commands.CreateTag;
using Application.Features.Tags.Commands.DeleteTag;
using Application.Features.Tags.Commands.UpdateTag;
using Application.Features.Tags.Queries.GetAllTags;
using Application.Features.Tags.Queries.GetTagById;
using Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace API.Controllers
{

    [Route("api/v1/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {

        private readonly IMessageBus _bus;

        public TagsController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Tags/id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var tag = await _bus.InvokeAsync<Tag>(new GetTagByIdQuery() { Id = id }, cancellationToken);
                return Ok(tag);
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

        // GET api/v1/Tags
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            try
            {
                var tags = await _bus.InvokeAsync<List<Tag>>(new GetAllTagsQuery(), cancellationToken);
                return Ok(tags);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/v1/Tags
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateTagCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _bus.InvokeAsync<Tag>(command, cancellationToken);

                return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
            } catch(ValidationException ex)
            {
                return BadRequest(ex.Errors);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (DbUpdateException ex)
            {
                return Conflict(ex.InnerException?.Message ?? ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/v1/Tags/id
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                // Los handlers sin respuesta (Update/Delete) se invocan sin tipo genérico.
                await _bus.InvokeAsync(new DeleteTagCommand() { Id = id }, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (DbUpdateException)
            {
                return Conflict("No se puede eliminar el tag porque tiene elementos asociados.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/v1/Tags/id
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateTagCommand command, CancellationToken cancellationToken)
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
            catch (DbUpdateException ex)
            {
                return Conflict(ex.InnerException?.Message ?? ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
