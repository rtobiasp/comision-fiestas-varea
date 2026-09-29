import { TriangleAlert } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { CategoriaDto } from "@/types";
import { CreateCategoriaDialog } from "./CreateCategoriaDialog";

type CategoriasCardFormProps = {
  categorias: CategoriaDto[];
  selectedCategoriaIds: Set<string>;
  onCreateCategoria: (
    formData: FormData,
  ) => CategoriaDto | Promise<CategoriaDto>;
  disabled?: boolean;
  loadError?: boolean;
  onRetry?: () => void;
  retrying?: boolean;
  fieldErrors?: string[];
};

export default function CategoriasCardForm({
  categorias,
  selectedCategoriaIds,
  onCreateCategoria,
  disabled = false,
  loadError = false,
  onRetry,
  retrying = false,
  fieldErrors = [],
}: CategoriasCardFormProps) {
  const missingIds = [...selectedCategoriaIds].filter(
    (id) => !categorias.some((c) => c.id === id),
  );
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías</CardTitle>
        <CreateCategoriaDialog
          onCreateCategoria={onCreateCategoria}
          disabled={disabled}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {missingIds.map((id) => (
          <input key={id} type="hidden" name="categoriaIds" value={id} />
        ))}
        {loadError && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>No se pudieron cargar las categorías</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>
                Puedes escribir y guardar igual; las categorías son opcionales.
              </p>
              {onRetry && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  disabled={disabled || retrying}
                  onClick={onRetry}
                >
                  {retrying ? "Reintentando…" : "Reintentar"}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
        {fieldErrors.length > 0 && (
          <div id="categorias-error" role="alert">
            {fieldErrors.map((m, i) => (
              <p key={i} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
        )}
        {categorias.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay categorías disponibles.
          </p>
        ) : (
          <div
            className={`flex max-h-60 flex-col gap-2 overflow-y-auto ${disabled ? "opacity-60" : ""}`}
            inert={disabled}
            aria-disabled={disabled}
          >
            {categorias.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <Checkbox
                  id={`categoria-${c.id}`}
                  name="categoriaIds"
                  value={c.id}
                  defaultChecked={selectedCategoriaIds.has(c.id)}
                />
                <Label
                  htmlFor={`categoria-${c.id}`}
                  className="cursor-pointer font-normal"
                >
                  {c.nombre}
                </Label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
