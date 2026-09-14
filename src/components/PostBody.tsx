"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { BlogBlock } from "@/lib/types";
import { slugify } from "@/lib/slugify";
import { ProductCard } from "./ProductCard";

const HEADER_OFFSET_PX = 110; // clears the sticky site header when jumping to a section

function isEmbedUrl(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function toEmbedUrl(url: string) {
  const youtube = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

// Renders the article body from its typed block list, and drives the
// sticky table-of-contents alongside it: which heading is "active" (via
// IntersectionObserver) and smooth-scrolling to a heading on click.
export function PostBody({ content }: { content: BlogBlock[] }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Headings double as the TOC — dedupe ids so two identically-worded
  // headings don't collide. `headingIdByBlockIndex` lets the render below
  // look up each heading block's id by its position in `content` instead
  // of mutating a counter while rendering.
  const { headings, headingIdByBlockIndex } = useMemo(() => {
    const seen = new Map<string, number>();
    const headings: { id: string; text: string }[] = [];
    const headingIdByBlockIndex = new Map<number, string>();

    content.forEach((b, i) => {
      if (b.type !== "heading") return;
      const base = slugify(b.text) || "section";
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      headings.push({ id, text: b.text });
      headingIdByBlockIndex.set(i, id);
    });

    return { headings, headingIdByBlockIndex };
  }, [content]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container || headings.length === 0) return;

    const elements = headings
      .map((h) => container.querySelector<HTMLElement>(`#${CSS.escape(h.id)}`))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-${HEADER_OFFSET_PX}px 0px -70% 0px`, threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  function jumpTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div className="grid gap-12 px-6 py-16 lg:grid-cols-[220px_1fr] lg:gap-16 lg:px-12">
      {headings.length > 0 && (
        <nav className="hidden self-start lg:sticky lg:top-28 lg:block">
          <p className="label-caps mb-4 text-ink-soft">On This Page</p>
          <ul className="space-y-1 border-l border-border">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    jumpTo(h.id);
                  }}
                  className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                    activeId === h.id ? "border-ink text-ink" : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div ref={contentRef} className="mx-auto w-full max-w-2xl space-y-8">
        {content.map((block, i) => {
          switch (block.type) {
            case "heading": {
              const id = headingIdByBlockIndex.get(i);
              return (
                <h2 key={i} id={id} className="scroll-mt-28 font-serif text-2xl text-ink sm:text-3xl">
                  {block.text}
                </h2>
              );
            }
            case "paragraph":
              return (
                <p key={i} className="leading-relaxed text-ink-soft">
                  {block.text}
                </p>
              );
            case "image":
              return (
                <figure key={i}>
                  <div
                    className={`relative overflow-hidden bg-cream-dark ${
                      block.aspect === "portrait" ? "aspect-[4/5]" : block.aspect === "square" ? "aspect-square" : "aspect-[16/10]"
                    }`}
                  >
                    <Image src={block.url} alt={block.caption ?? ""} fill sizes="672px" className="object-cover" />
                  </div>
                  {block.caption && <figcaption className="mt-2 text-xs text-ink-soft">{block.caption}</figcaption>}
                </figure>
              );
            case "video":
              return (
                <figure key={i}>
                  <div className="relative aspect-video overflow-hidden bg-ink">
                    {isEmbedUrl(block.url) ? (
                      <iframe
                        src={toEmbedUrl(block.url)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    ) : (
                      <video src={block.url} controls playsInline className="h-full w-full object-cover" />
                    )}
                  </div>
                  {block.caption && <figcaption className="mt-2 text-xs text-ink-soft">{block.caption}</figcaption>}
                </figure>
              );
            case "quote":
              return (
                <blockquote key={i} className="border-l-2 border-gold py-1 pl-6">
                  <p className="font-serif text-xl leading-snug text-ink">&ldquo;{block.text}&rdquo;</p>
                  {block.attribution && <cite className="mt-2 block text-xs not-italic text-ink-soft">{block.attribution}</cite>}
                </blockquote>
              );
            case "product":
              return block.product ? (
                <div key={i} className="max-w-xs">
                  <ProductCard product={block.product} />
                </div>
              ) : null;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
