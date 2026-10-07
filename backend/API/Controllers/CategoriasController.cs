using Application.Features.Categorias.Commands.CreateCategoria;
using Application.Features.Categorias.Commands.DeleteCategoria;
using Application.Features.Categorias.Commands.UpdateCategoria;
using Application.Features.Categorias.Dtos;
using Application.Features.Categorias.Queries.GetAllCategorias;
using Application.Features.Categorias.Queries.GetCategoriaById;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace API.Controllers
{

    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class CategoriasController : ControllerBase
    {

        private readonly IMessageBus _bus;

        public CategoriasController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Categorias/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(CategoriaDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CategoriaDto>> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var categoria = await _bus.InvokeAsync<CategoriaDto>(new GetCategoriaByIdQuery() { Id = id }, cancellationToken);
                return Ok(categoria);
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

        // GET api/v1/Categorias?orderBy=&direction=
        [HttpGet]
        [ProducesResponseType(typeof(List<CategoriaDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<CategoriaDto>>> GetAll([FromQuery] string? orderBy, [FromQuery] string? direction, CancellationToken cancellationToken)
        {
            try
            {
                var categorias = await _bus.InvokeAsync<List<CategoriaDto>>(new GetAllCategoriasQuery { OrderBy = orderBy, Direction = direction }, cancellationToken);
                return Ok(categorias);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Errors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/v1/Categorias
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(CategoriaDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<CategoriaDto>> Post([FromBody] CreateCategoriaCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _bus.InvokeAsync<CategoriaDto>(command, cancellationToken);

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

        // DELETE api/v1/Categorias/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                // Los handlers sin respuesta (Update/Delete) se invocan sin tipo genérico.
                await _bus.InvokeAsync(new DeleteCategoriaCommand() { Id = id }, cancellationToken);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (DbUpdateException)
            {
                return Conflict("No se puede eliminar la categoría porque tiene subcategorías asociadas.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/v1/Categorias/id
        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateCategoriaCommand command, CancellationToken cancellationToken)
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
