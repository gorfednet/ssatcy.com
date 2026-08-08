import { Mail } from "lucide-react";
import { SiteLogoMark } from "../components/SiteLogoMark";

type FooterSectionProps = {
  scrollToSection: (id: string) => void;
  revealedEmail: string;
  revealEmail: () => void;
};

export function FooterSection({
  scrollToSection,
  revealedEmail,
  revealEmail,
}: FooterSectionProps) {
  return (
    <footer
      id="contact"
      role="contentinfo"
      className="border-t border-white/10 bg-zinc-950/90 pt-16 md:pt-24 pb-8 md:pb-12 relative z-30"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 mb-20">
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-4 mb-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-full group"
              aria-label="Scroll to home"
            >
              <SiteLogoMark
                label={
                  <span className="text-2xl font-black tracking-widest text-white uppercase leading-none drop-shadow-md group-hover:text-yellow-500 transition-colors">
                    SSATCY
                  </span>
                }
              />
            </button>
            <p className="site-copy-muted max-w-md">
              Music made in Toronto&apos;s West End from hip-hop,
              downtempo, jungle, and sounds gathered farther
              afield. Built for headphones, screens, and rooms
              with the lights low.
            </p>
          </div>

          <div>
            <h3 className="text-white text-sm font-black tracking-widest uppercase mb-8 border-b border-white/10 pb-4">
              Inquiries
            </h3>
            <ul className="space-y-6">
              <li>
                {revealedEmail ? (
                  <a
                    href={`mailto:${revealedEmail}`}
                    className="group flex items-center gap-4 text-lg font-bold text-zinc-300 transition-colors hover:text-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 md:text-xl rounded p-1 -ml-1"
                    aria-label={`Email management at ${revealedEmail}`}
                  >
                    <Mail
                      className="h-5 w-5 shrink-0 text-yellow-500 transition-transform group-hover:scale-110"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {revealedEmail}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={revealEmail}
                    className="group flex items-center gap-4 text-lg font-bold text-zinc-300 transition-colors hover:text-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 md:text-xl rounded p-1 -ml-1"
                    aria-label="Reveal management email"
                  >
                    <Mail
                      className="h-5 w-5 shrink-0 text-yellow-500 transition-transform group-hover:scale-110"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Reveal Email
                  </button>
                )}
              </li>
              <li className="text-lg leading-relaxed text-zinc-500 md:text-xl">
                Working from Toronto and available worldwide for
                sync licensing, scoring, live performances, DJ
                sets, and selected brand collaborations.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} SSATCY. All
            Rights Reserved.
          </p>
          <div
            className="flex gap-1 h-1.5 w-32"
            aria-hidden="true"
          >
            <div className="flex-1 bg-green-600/80" />
            <div className="flex-1 bg-yellow-500/80" />
            <div className="flex-1 bg-red-600/80" />
          </div>
        </div>
      </div>
    </footer>
  );
}
