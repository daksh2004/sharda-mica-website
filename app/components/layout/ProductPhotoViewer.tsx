import { IconPhoto } from "@tabler/icons-react";

import type { ProductPhoto } from "@/lib/store";

export function ProductPhotoViewer({
  photos,
  name,
}: {
  photos: ProductPhoto[];
  name: string;
}) {
  if (photos.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 border-b border-[#e6e1d5] bg-[#f7f5ee] text-[#77786f] sm:h-52">
        <IconPhoto size={27} stroke={1.5} aria-hidden="true" />
        <span className="px-4 text-center text-xs font-medium">
          Waiting for the final product photo
        </span>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-3 border-b border-[#e6e1d5] bg-[#f7f5ee] p-3 ${photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
    >
      {photos.map((photo, index) => (
        <figure key={`${photo.src}-${index}`} className="min-w-0 bg-white p-2">
          <img
            src={photo.src}
            alt={photo.alt || name}
            width={900}
            height={600}
            loading="lazy"
            className="aspect-[3/2] h-auto w-full object-contain"
          />
          <figcaption className="pt-2 text-center text-xs font-semibold text-[#34452e]">
            {photo.alt || name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
