import { createClient } from "@/lib/supabase/server";
import { updateSiteSettings } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { SiteSettings } from "@/lib/types";

export default async function AdminPersonalizacaoPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .maybeSingle<SiteSettings>();

  if (!settings) return null;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-preto-wagyu">Personalização</h1>
      <p className="mb-6 text-cinza-ferro">
        Ajuste a imagem de capa da página inicial e as cores principais do
        site.
      </p>

      <form
        action={updateSiteSettings.bind(null, settings.id)}
        className="flex max-w-lg flex-col gap-6"
      >
        <section className="rounded-lg border border-cinza-osso p-4">
          <h2 className="mb-3 font-semibold text-preto-wagyu">
            Imagem de capa (página inicial)
          </h2>
          <ImageUploadField
            name="hero_image_url"
            label="Foto de fundo do topo do site"
            folder="site"
            defaultValue={settings.hero_image_url}
            aspect="video"
          />
          <ul className="mt-3 list-disc pl-5 text-xs text-cinza-ferro">
            <li>Tamanho ideal: entre 2400 e 3000 pixels de largura.</li>
            <li>
              Formato retangular e baixo, tipo 16:9 (ex: 2400x1200px) — a
              imagem aparece cortada, larga e não muito alta.
            </li>
            <li>Arquivo JPG ou WebP, de preferência abaixo de 500KB.</li>
            <li>
              Prefira fotos com a parte mais importante centralizada — as
              bordas podem ser cortadas em telas de celular.
            </li>
          </ul>
          <p className="mt-2 text-xs text-cinza-ferro">
            Deixe em branco (clique em &quot;Remover&quot;) para usar a
            imagem padrão do site.
          </p>
        </section>

        <section className="rounded-lg border border-cinza-osso p-4">
          <h2 className="mb-3 font-semibold text-preto-wagyu">Cores</h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between gap-3 text-sm text-preto-wagyu">
              Cor principal (botões e destaques)
              <input
                type="color"
                name="primary_color"
                defaultValue={settings.primary_color}
                className="h-10 w-16 cursor-pointer rounded border border-cinza-osso"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm text-preto-wagyu">
              Cor ao passar o mouse (hover)
              <input
                type="color"
                name="primary_hover_color"
                defaultValue={settings.primary_hover_color}
                className="h-10 w-16 cursor-pointer rounded border border-cinza-osso"
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          className="w-fit rounded-full bg-vermelho-brasa px-6 py-2 font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
