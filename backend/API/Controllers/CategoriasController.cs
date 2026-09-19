using Application.Features.Categorias.Commands.CreateCategoria;
using Application.Features.Categorias.Commands.DeleteCategoria;
using Application.Features.Categorias.Commands.UpdateCategoria;
using Application.Features.Categorias.Queries.GetAllCategorias;
using Application.Features.Categorias.Queries.GetCategoriaById;
using Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace API.Controllers
{

    [Route("api/v1/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {

        private readonly IMessageBus _bus;

        public CategoriasController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Categorias/id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var categoria = await _bus.InvokeAsync<Categoria>(new GetCategoriaByIdQuery() { Id = id }, cancellationToken);
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

        // GET api/v1/Categorias
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            try
            {
                var categorias = await _bus.InvokeAsync<List<Categoria>>(new GetAllCategoriasQuery(), cancellationToken);
                return Ok(categorias);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/v1/Categorias
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateCategoriaCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _bus.InvokeAsync<Categoria>(command, cancellationToken);

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
