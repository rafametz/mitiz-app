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
  aspect = "video",
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string | null;
  aspect?: "square" | "video";
}) {
  const supabase = useRef(createClient()).current;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const previousPath = url ? extractStoragePath(url) : null;
    if (previousPath) {
      await supabase.storage.from("images").remove([previousPath]);
    }
    setUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-preto-wagyu">{label}</span>
      <input type="hidden" name={name} value={url} />

      <label
        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition ${
          aspect === "square" ? "aspect-square w-40" : "aspect-video w-full max-w-md"
        } ${
          dragOver
            ? "border-vermelho-brasa bg-marmoreio"
            : "border-cinza-osso bg-marmoreio hover:border-preto-wagyu"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) uploadFile(file);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading}
          className="hidden"
        />

        {url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-preto-wagyu/0 opacity-0 transition group-hover:bg-preto-wagyu/55 group-hover:opacity-100">
              <span className="rounded-full bg-branco-sal px-3 py-1.5 text-xs font-semibold text-preto-wagyu">
                Trocar imagem
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-full bg-vermelho-brasa px-3 py-1.5 text-xs font-semibold text-branco-sal hover:bg-sangue-nobre"
              >
                Remover
              </button>
            </div>
          </>
        ) : uploading ? (
          <span className="text-sm text-cinza-ferro">Enviando imagem...</span>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-4 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8 text-cinza-ferro"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-sm font-semibold text-preto-wagyu">Adicionar imagem</span>
            <span className="text-xs text-cinza-ferro">
              Clique ou arraste aqui — PNG/JPG até {MAX_SIZE_MB}MB
            </span>
          </div>
        )}
      </label>

      {error && <p className="text-xs text-vermelho-brasa">{error}</p>}
    </div>
  );
}
