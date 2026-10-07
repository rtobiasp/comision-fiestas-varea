import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ListError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>No se ha podido cargar el listado</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
