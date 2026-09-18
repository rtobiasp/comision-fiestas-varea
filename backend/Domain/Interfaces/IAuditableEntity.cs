using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Interfaces
{
    public interface IAuditableEntity
    {
        DateTime CreatedAt { get; set; }
        string CreatedBy { get; set; }
        DateTime? LastModifiedAt { get; set; }
        string? LastModifiedBy { get; set; }
    }

}
