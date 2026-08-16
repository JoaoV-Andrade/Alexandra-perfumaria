import Image from "next/image";

// Grade com as fotos já cadastradas do produto, cada uma com um checkbox
// "Remover" — usada só na tela de edição.
export function ExistingImagesField({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  return (
    <div>
      <span className="text-sm font-medium text-foreground">Fotos atuais</span>
      <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((url) => (
          <label
            key={url}
            className="flex flex-col items-center gap-1.5 text-xs"
          >
            <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-surface">
              <Image
                src={url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <span className="flex items-center gap-1 text-muted-foreground">
              <input
                name="remove_images"
                type="checkbox"
                value={url}
                className="h-3.5 w-3.5 rounded border-muted-foreground/40 accent-accent"
              />
              Remover
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
