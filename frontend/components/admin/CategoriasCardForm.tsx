import { Checkbox } from "@/components/ui/checkbox";
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
};

export default function CategoriasCardForm({
  categorias,
  selectedCategoriaIds,
  onCreateCategoria,
}: CategoriasCardFormProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías</CardTitle>
        <CreateCategoriaDialog onCreateCategoria={onCreateCategoria} />
      </CardHeader>
      <CardContent>
        {categorias.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay categorías disponibles.
          </p>
        ) : (
          <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
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
