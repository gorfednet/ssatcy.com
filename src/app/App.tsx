import {
  motion,
  AnimatePresence,
} from "motion/react";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";
import { SiteLogoMark } from "./components/SiteLogoMark";
import { NAV_LINKS } from "./content";
import { BioSection } from "./sections/BioSection";
import { FilmSection } from "./sections/FilmSection";
import { FooterSection } from "./sections/FooterSection";
import { GallerySection } from "./sections/GallerySection";
import { GamesSection } from "./sections/GamesSection";
import { HeroSection } from "./sections/HeroSection";
import { LiveSection } from "./sections/LiveSection";
import { MusicSection } from "./sections/MusicSection";

const HOME_SECTION_ID = "home";
const CONTACT_SECTION_ID = "contact";
const SECTION_ID_SET = new Set(
  [
    HOME_SECTION_ID,
    ...NAV_LINKS.map((link) => link.id),
    CONTACT_SECTION_ID,
  ].map((id) => id.toLowerCase()),
);
const URL_TRACKED_SECTION_IDS = [
  HOME_SECTION_ID,
  ...NAV_LINKS.map((link) => link.id).filter((id) => id !== HOME_SECTION_ID),
  CONTACT_SECTION_ID,
];

const getSectionIdFromPath = (pathname: string) => {
  const normalizedPath = pathname
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
  if (!normalizedPath) return HOME_SECTION_ID;
  return SECTION_ID_SET.has(normalizedPath)
    ? normalizedPath
    : HOME_SECTION_ID;
};

const getPathFromSectionId = (sectionId: string) =>
  sectionId === HOME_SECTION_ID ? "/" : `/${sectionId}`;

export default function App() {
  // Header state and section tracking drive sticky navigation behavior.
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(false);
  const [revealedEmail, setRevealedEmail] = useState("");
  const lowMotionMode = prefersReducedMotion;

  const syncBrowserPath = (
    sectionId: string,
    mode: "push" | "replace" = "replace",
  ) => {
    const targetPath = getPathFromSectionId(sectionId);
    if (window.location.pathname === targetPath) return;
    window.history[mode === "push" ? "pushState" : "replaceState"](
      null,
      "",
      targetPath,
    );
  };

  const scrollToSection = (
    id: string,
    options?: {
      behavior?: ScrollBehavior;
      historyMode?: "push" | "replace" | "none";
    },
  ) => {
    // Close the mobile menu first so users keep context after tapping a link.
    setIsMobileMenuOpen(false);
    const safeId = SECTION_ID_SET.has(id.toLowerCase())
      ? id
      : HOME_SECTION_ID;
    const element = document.getElementById(safeId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: options?.behavior ?? (lowMotionMode ? "auto" : "smooth"),
      });
      if (options?.historyMode && options.historyMode !== "none") {
        syncBrowserPath(safeId, options.historyMode);
      }
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const handleChange = () =>
      setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () =>
      mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Scroll spy: marks the nav item that matches the section in view.
    // This keeps long-form pages easier to navigate, especially on mobile.
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const isHeaderScrolled = window.scrollY > 50;
        setIsScrolled((previous) =>
          previous === isHeaderScrolled
            ? previous
            : isHeaderScrolled,
        );

        // Determine active section for nav highlighting.
        const sections = URL_TRACKED_SECTION_IDS.map((id) =>
          document.getElementById(id),
        );
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const sectionId = URL_TRACKED_SECTION_IDS[i];
          if (section && section.offsetTop <= scrollPosition) {
            if (SECTION_ID_SET.has(sectionId)) {
              syncBrowserPath(sectionId, "replace");
              if (sectionId !== CONTACT_SECTION_ID) {
                setActiveSection((previous) =>
                  previous === sectionId
                    ? previous
                    : sectionId,
                );
              }
            }
            break;
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  const revealEmail = () => {
    // Keep the address out of static HTML and construct only on user interaction.
    const email = String.fromCharCode(
      109, 97, 110, 97, 103, 101, 109, 101, 110, 116, 64, 115,
      115, 97, 116, 99, 121, 46, 99, 111, 109,
    );
    setRevealedEmail(email);
  };

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let settleTimer = 0;

    const routeToCurrentPath = () => {
      const sectionId = getSectionIdFromPath(window.location.pathname);
      const alignSection = () =>
        scrollToSection(sectionId, {
          behavior: "auto",
          historyMode: "replace",
        });

      alignSection();
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(alignSection);
      });
      settleTimer = window.setTimeout(alignSection, 250);
    };

    routeToCurrentPath();
    window.addEventListener("popstate", routeToCurrentPath);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimer);
      window.removeEventListener("popstate", routeToCurrentPath);
    };
  }, []);

  return (
    <div
      className="bg-zinc-950 text-zinc-200 font-sans selection:bg-yellow-500/30 selection:text-yellow-200 min-h-screen overflow-x-hidden"
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      {/* Header */}
      <header
        role="banner"
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "py-4" : "py-6",
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 transition-opacity duration-500 border-b",
            isScrolled
              ? "opacity-100 bg-zinc-950/95 border-white/10"
              : "opacity-0 border-transparent",
          )}
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 group relative z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-full"
            aria-label="Scroll to home"
          >
            <SiteLogoMark
              label={
                <div className="flex flex-col text-left">
                  <span className="text-xl md:text-2xl font-black tracking-widest text-white uppercase leading-none drop-shadow-md">
                    SSATCY
                  </span>
                </div>
              }
            />
          </button>

          {/* Desktop Nav */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-8 bg-zinc-900/75 px-8 py-3 rounded-full border border-white/10"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  type="button"
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className={clsx(
                    "text-sm font-bold tracking-[0.2em] uppercase transition-colors relative py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-md",
                    isActive
                      ? "text-yellow-500"
                      : "text-zinc-400 hover:text-white",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden relative z-50 p-3 bg-zinc-900 rounded-full border border-white/10 text-zinc-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-dialog"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            id="mobile-navigation-dialog"
            className="fixed inset-0 z-40 bg-zinc-950/98 flex flex-col pt-32 px-6 pb-6"
            role="dialog"
            aria-modal="true"
          >
            <nav className="flex flex-col gap-8 items-center mt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className={clsx(
                      "text-3xl font-black tracking-[0.2em] uppercase transition-colors block",
                      activeSection === link.id
                        ? "text-yellow-500"
                        : "text-zinc-300 hover:text-white",
                    )}
                    aria-current={
                      activeSection === link.id ? "page" : undefined
                    }
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" role="main">
        <HeroSection scrollToSection={scrollToSection} />
        <BioSection />
        <MusicSection
          lowMotionMode={lowMotionMode}
          scrollToSection={scrollToSection}
        />
        <FilmSection />
        <GamesSection />
        <LiveSection />
        <GallerySection lowMotionMode={lowMotionMode} />
      </main>

      <FooterSection
        scrollToSection={scrollToSection}
        revealedEmail={revealedEmail}
        revealEmail={revealEmail}
      />
    </div>
  );
}
