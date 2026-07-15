import { NewsForm } from "@/components/admin/NewsForm";
import { createNews } from "../actions";

export default function NovaNovidadePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Nova novidade</h1>
      <NewsForm action={createNews} />
    </div>
  );
}
