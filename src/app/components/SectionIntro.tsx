import type { ReactNode } from "react";

type SectionIntroProps = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  titleAdornment?: ReactNode;
  className?: string;
};

export function SectionIntro({
  icon,
  title,
  description,
  titleAdornment,
  className,
}: SectionIntroProps) {
  // Shared section intro block keeps headings visually consistent across pages.
  return (
    <div
      className={`mb-16 md:mb-24 border-l-4 border-yellow-500 pl-6 md:pl-8 text-left ${className ?? ""}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          {icon}
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter">
            {title}
          </h2>
        </div>
        {titleAdornment}
      </div>
      <div className="site-copy-lead">{description}</div>
    </div>
  );
}
