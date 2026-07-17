import type { EventItem } from "@/lib/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function EventForm({
  event,
  action,
}: {
  event?: EventItem;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-3">
      <ImageUploadField
        name="image_url"
        label="Imagem do evento"
        folder="events"
        defaultValue={event?.image_url}
      />

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Título
        <input
          name="title"
          required
          defaultValue={event?.title}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
        Descrição
        <textarea
          name="description"
          defaultValue={event?.description ?? ""}
          className="rounded border border-cinza-osso px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Data e hora
          <input
            type="datetime-local"
            name="event_date"
            required
            defaultValue={event?.event_date?.slice(0, 16) ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
          Local
          <input
            name="location"
            defaultValue={event?.location ?? ""}
            className="rounded border border-cinza-osso px-3 py-2"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-preto-wagyu">
        <input type="checkbox" name="is_active" defaultChecked={event?.is_active ?? true} />
        Ativo
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
