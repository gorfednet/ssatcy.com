import type { ReactNode } from "react";
import { Disc } from "lucide-react";

type SiteLogoMarkProps = {
  label: ReactNode;
  iconClassName?: string;
};

/** Shared disc + palette strip so header/footer stay visually identical. */
export function SiteLogoMark({
  label,
  iconClassName = "w-6 h-6 text-zinc-300 group-hover:text-yellow-500 transition-colors",
}: SiteLogoMarkProps) {
  return (
    <>
      <div className="relative w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-full overflow-hidden border border-white/20 group-hover:border-yellow-500/80 transition-colors shadow-lg shadow-black/50">
        <Disc className={iconClassName} aria-hidden="true" />
        <div
          className="absolute inset-x-0 bottom-0 h-1.5 flex"
          aria-hidden="true"
        >
          <div className="flex-1 bg-green-600/80" />
          <div className="flex-1 bg-yellow-500/80" />
          <div className="flex-1 bg-red-600/80" />
        </div>
      </div>
      {label}
    </>
  );
}
