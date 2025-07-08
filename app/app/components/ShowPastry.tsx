import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchPastry } from "src/data/queries";

export default function ShowPastry({ pastry }) {
  if (!pastry) {
    return <div>Pastry not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pastry.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{pastry.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
