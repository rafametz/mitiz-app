"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE_MB = 5;
const STORAGE_PREFIX = "/storage/v1/object/public/images/";

function extractStoragePath(url: string) {
  const idx = url.indexOf(STORAGE_PREFIX);
  return idx === -1 ? null : url.slice(idx + STORAGE_PREFIX.length);
}

export function ImageUploadField({
  name,
  label,
  folder,
  defaultValue,
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string | null;
}) {
  const supabase = useRef(createClient()).current;
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Escolha um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`A imagem deve ter no máximo ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setUploading(true);

    const path = `${folder}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError("Não foi possível enviar a imagem. Tente novamente.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path);

    const previousPath = url ? extractStoragePath(url) : null;
    if (previousPath) {
      await supabase.storage.from("images").remove([previousPath]);
    }

    setUrl(data.publicUrl);
    setUploading(false);
  }

  async function handleRemove() {
    const previousPath = url ? extractStoragePath(url) : null;
    if (previousPath) {
      await supabase.storage.from("images").remove([previousPath]);
    }
    setUrl("");
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-preto-wagyu">
      <span>{label}</span>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="relative w-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="aspect-square w-40 rounded-lg border border-cinza-osso object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="mt-1 text-xs text-vermelho-brasa hover:underline"
          >
            Remover imagem
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="text-sm"
      />

      {uploading && <p className="text-xs text-cinza-ferro">Enviando imagem...</p>}
      {error && <p className="text-xs text-vermelho-brasa">{error}</p>}
    </div>
  );
}
