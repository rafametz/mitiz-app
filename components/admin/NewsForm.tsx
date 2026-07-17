import type { NewsItem } from "@/lib/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function NewsForm({
  item,
  action,
}: {
  item?: NewsItem;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Título
        <input
          name="title"
          required
          defaultValue={item?.title}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Texto
        <textarea
          name="body"
          rows={5}
          defaultValue={item?.body ?? ""}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <ImageUploadField
        name="image_url"
        label="Imagem da novidade"
        folder="news"
        defaultValue={item?.image_url}
      />

      <label className="flex items-center gap-2 text-sm text-preto-wagyu">
        <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} />
        Publicada
      </label>

      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-vermelho-brasa px-6 py-2 font-semibold text-branco-sal hover:bg-sangue-nobre"
      >
        Salvar
      </button>
    </form>
  );
}
