import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { ResponsiveImage } from "../content";

type FeaturedMediaCardProps = {
  layout: "image-start" | "image-end";
  image: ResponsiveImage;
  imageAlt: string;
  title: string;
  meta: ReactNode;
  children: ReactNode;
  /** Hover wash on the text column (matches prior red vs green film/game accents). */
  contentAccent: "red" | "green";
  imageBadge?: ReactNode;
};

/**
 * Film / games feature rows share the same grid, image treatment, and footer strip;
 * `image-end` mirrors the Unit 5 pilot layout (image on the right on large screens).
 */
export function FeaturedMediaCard({
  layout,
  image,
  imageAlt,
  title,
  meta,
  children,
  contentAccent,
  imageBadge,
}: FeaturedMediaCardProps) {
  const accentOverlay =
    contentAccent === "red"
      ? "from-red-600/5"
      : "from-green-600/5";

  const imageBlock = (
    <div
      className={
        layout === "image-start"
          ? "relative h-64 md:h-80 lg:h-auto overflow-hidden border-b border-black lg:border-b-0 lg:border-r"
          : "relative h-64 md:h-80 lg:h-auto overflow-hidden border-b border-black lg:order-2 lg:border-b-0 lg:border-l"
      }
    >
      <span className="photo-grayscale-feature-thumb absolute inset-0 block">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={image.width}
          height={image.height}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </span>
      <div
        className={
          layout === "image-start"
            ? "absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 to-transparent pointer-events-none"
            : "absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-black/90 to-transparent pointer-events-none"
        }
        aria-hidden="true"
      />
      {imageBadge}
    </div>
  );

  const contentBlock = (
    <div
      className={
        layout === "image-start"
          ? "p-6 md:p-10 lg:p-20 flex flex-col justify-center relative bg-gradient-to-br from-zinc-900 to-black"
          : "p-6 md:p-10 lg:p-20 flex flex-col justify-center relative bg-gradient-to-bl from-zinc-900 to-black lg:order-1"
      }
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accentOverlay} to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-active:opacity-100`}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
          {title}
        </h3>
        <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase mb-8 flex flex-wrap items-center gap-3">
          {meta}
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative touch-manipulation overflow-hidden rounded-sm border border-white/10 bg-zinc-950 mb-16 last:mb-0 shadow-2xl [-webkit-tap-highlight-color:transparent]"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {imageBlock}
        {contentBlock}
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-20 h-1.5 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-active:opacity-100"
        aria-hidden="true"
      />
    </motion.article>
  );
}
