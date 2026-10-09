"use client";

import { useState } from "react";
import Image from "next/image";

// Cards are a 3:4 portrait frame. Most product shots are portrait and fill it
// well with `object-cover`, but a landscape or near-square photo gets its
// sides sliced off by that crop (a wide burner showing only its middle, a
// bottle cut in half). Once the image's real proportions are known, anything
// that isn't comfortably portrait is shown whole (`object-contain`) on a
// white ground instead of cropped. White matches the studio backgrounds
// these photos are shot on, so the frame still reads as one clean tile.
const CONTAIN_ABOVE_RATIO = 0.85; // width / height

export function ProductCardImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const [contain, setContain] = useState(false);

  return (
    <span className={`absolute inset-0 block ${contain ? "bg-white" : ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setContain(img.naturalWidth / img.naturalHeight > CONTAIN_ABOVE_RATIO);
          }
        }}
        className={contain ? "object-contain p-3" : "object-cover"}
      />
    </span>
  );
}
