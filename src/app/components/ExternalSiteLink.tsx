import type { ReactNode } from "react";

const linkClass =
  "text-yellow-500 transition-colors hover:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-sm";

type ExternalSiteLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/** Third-party links: new tab + tab-nabbing mitigation without changing copy styling. */
export function ExternalSiteLink({
  href,
  children,
  className,
}: ExternalSiteLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? linkClass}
    >
      {children}
    </a>
  );
}
