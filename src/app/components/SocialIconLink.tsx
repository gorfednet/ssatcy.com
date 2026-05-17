import type { ReactNode } from "react";

type Accent = "green" | "yellow" | "red";

type SocialIconLinkProps = {
  href: string;
  ariaLabel: string;
  accent: Accent;
  icon: ReactNode;
};

const ACCENT_CLASS_MAP: Record<Accent, string> = {
  green:
    "hover:bg-green-600 hover:border-green-500 hover:text-white focus-visible:ring-green-500",
  yellow:
    "hover:bg-yellow-500 hover:border-yellow-500 hover:text-black focus-visible:ring-yellow-500",
  red:
    "hover:bg-red-600 hover:border-red-500 hover:text-white focus-visible:ring-red-500",
};

export function SocialIconLink({
  href,
  ariaLabel,
  accent,
  icon,
}: SocialIconLinkProps) {
  // Uniform external-link treatment avoids subtle security/accessibility drift.
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all text-zinc-300 focus:outline-none focus-visible:ring-2 ${ACCENT_CLASS_MAP[accent]}`}
      aria-label={ariaLabel}
    >
      {icon}
    </a>
  );
}
