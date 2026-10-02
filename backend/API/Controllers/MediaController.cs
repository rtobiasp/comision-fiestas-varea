using Application.Features.Media.Commands.DeleteMedia;
using Application.Features.Media.Commands.UpdateMedia;
using Application.Features.Media.Commands.UploadMedia;
using Application.Features.Media.Dtos;
using Application.Features.Media.Queries.GetMediaById;
using Application.Features.Media.Queries.GetMediaList;
using Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class MediaController : ControllerBase
    {
        private readonly IMessageBus _bus;

        public MediaController(IMessageBus bus)
        {
            _bus = bus;
        }

        // GET: api/v1/Media/id
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(MediaDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<MediaDto>> GetById(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var asset = await _bus.InvokeAsync<MediaDto>(new GetMediaByIdQuery() { Id = id }, cancellationToken);
                return Ok(asset);
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

        // GET api/v1/Media?tipo=&offset=&limit=
        [HttpGet]
        [ProducesResponseType(typeof(List<MediaDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<MediaDto>>> GetList([FromQuery] MediaTipo? tipo, [FromQuery] int? offset, [FromQuery] int? limit, CancellationToken cancellationToken)
        {
            try
            {
                var assets = await _bus.InvokeAsync<List<MediaDto>>(
                    new GetMediaListQuery { Tipo = tipo, Offset = offset, Limit = limit }, cancellationToken);
                return Ok(assets);
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

        // POST api/v1/Media/upload (multipart/form-data)
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(55_000_000)]
        [ProducesResponseType(typeof(MediaDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<MediaDto>> Upload(IFormFile file, [FromForm] string? altText, CancellationToken cancellationToken)
        {
            if (file is null || file.Length == 0)
                return BadRequest("El archivo es obligatorio y no puede estar vacío.");

            try
            {
                await using var stream = file.OpenReadStream();
                var asset = await _bus.InvokeAsync<MediaDto>(new UploadMediaCommand
                {
                    Contenido = stream,
                    NombreOriginal = file.FileName,
                    ContentType = file.ContentType,
                    TamanoBytes = file.Length,
                    AltText = altText
                }, cancellationToken);

                return CreatedAtAction(nameof(GetById), new { id = asset.Id }, asset);
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

        // PUT api/v1/Media/id (solo metadatos: título y alt. No renombra el fichero)
        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Put(Guid id, [FromBody] UpdateMediaCommand command, CancellationToken cancellationToken)
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

        // DELETE api/v1/Media/id
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                await _bus.InvokeAsync(new DeleteMediaCommand() { Id = id }, cancellationToken);
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
