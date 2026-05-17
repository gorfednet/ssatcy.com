import {
  motion,
  AnimatePresence,
} from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Disc,
  Film,
  Trophy,
  Gamepad2,
  ArrowRight,
  Music,
  Users,
  Activity,
  Calendar,
  Camera,
  MapPin,
  ExternalLink,
  Mail,
} from "lucide-react";
import clsx from "clsx";
import Masonry, {
  ResponsiveMasonry,
} from "react-responsive-masonry";
import { HandlebarEventCard } from "./components/HandlebarEventCard";
import { ExternalSiteLink } from "./components/ExternalSiteLink";
import { FeaturedMediaCard } from "./components/FeaturedMediaCard";
import { SectionIntro } from "./components/SectionIntro";
import { SiteLogoMark } from "./components/SiteLogoMark";
import {
  FEATURE_IMAGES,
  GALLERY_IMAGES,
  NAV_LINKS,
  PAST_EVENTS,
  UPCOMING_EVENTS,
} from "./content";

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
  const containerRef = useRef<HTMLDivElement>(null);
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
    const routeToCurrentPath = () => {
      const sectionId = getSectionIdFromPath(window.location.pathname);
      scrollToSection(sectionId, {
        behavior: "auto",
        historyMode: "replace",
      });
    };

    routeToCurrentPath();
    window.addEventListener("popstate", routeToCurrentPath);
    return () => window.removeEventListener("popstate", routeToCurrentPath);
  }, []);

  return (
    <div
      ref={containerRef}
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
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-zinc-950/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/80 z-20" />
            {/* Jamaican accent wash — heavy blur so blobs read as ambient color, not shapes */}
            <div className="absolute -bottom-32 left-0 w-[min(100%,48rem)] h-[22rem] md:h-[28rem] bg-yellow-500/[0.07] rounded-full z-10 mix-blend-screen blur-[100px] md:blur-[130px] scale-125" />
            <div className="absolute top-[8%] -right-24 w-[28rem] h-[28rem] md:w-[36rem] md:h-[36rem] bg-red-600/[0.07] rounded-full z-10 mix-blend-screen blur-[100px] md:blur-[130px]" />
            <div className="absolute bottom-[12%] -left-20 w-[26rem] h-[26rem] md:w-[34rem] md:h-[34rem] bg-green-600/[0.07] rounded-full z-10 mix-blend-screen blur-[100px] md:blur-[130px]" />

            {/* Main Hero Background - starts muted, blooms on hover (simulated by group hover on hero or just left as gritty) */}
            <div className="group relative w-full h-full">
              <img
                src={FEATURE_IMAGES.bio}
                alt="SSATCY Abstract Background"
                className="w-full h-full object-cover object-[center_45%] opacity-40 grayscale contrast-125 transition-all duration-1000"
              />
            </div>
          </motion.div>

          <div className="relative z-30 container mx-auto px-6 flex flex-col items-center text-center pt-16 md:pt-20">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <div
                className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-green-500/50"
                aria-hidden="true"
              />
              <span className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-xs md:text-sm">
                Toronto • Global
              </span>
              <div
                className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-red-500/50"
                aria-hidden="true"
              />
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[4rem] sm:text-7xl md:text-8xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-300 to-zinc-800 tracking-tighter uppercase mb-6 leading-none drop-shadow-2xl"
            >
              SSATCY
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-3xl text-zinc-300 font-light max-w-2xl mx-auto mb-16 tracking-widest uppercase drop-shadow-lg"
            >
              Sunshine Sneeze and the Contagious Yawn
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("bio")}
                className="group flex items-center justify-center gap-3 bg-yellow-500 text-black px-6 py-4 md:px-10 md:py-5 rounded-sm font-black tracking-widest uppercase hover:bg-yellow-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500/50 w-full sm:w-auto shadow-xl"
              >
                The Origin
                <ArrowRight
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* BIOGRAPHY SECTION (Vibrant full color per requirements) */}
        <section
          id="bio"
          className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden border-t border-white/5 z-20"
        >
          <motion.div
            className="absolute -inset-[35%] bg-gradient-to-bl from-yellow-500/[0.04] via-transparent to-transparent pointer-events-none blur-[90px] md:blur-[120px]"
            aria-hidden="true"
          />

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SectionIntro
                icon={
                  <Users
                    className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 shrink-0"
                    aria-hidden="true"
                  />
                }
                title="The Origin"
                description={
                  <>
                    Sunshine Sneeze and the Contagious Yawn
                    (SSATCY) is the uncompromising musical vision
                    of{" "}
                    <ExternalSiteLink href="https://gorfmusic.com">
                      "Gorf"
                    </ExternalSiteLink>{" "}
                    and{" "}
                    <ExternalSiteLink href="https://tohuxtable.bandcamp.com/">
                      "T.O Huxtable"
                    </ExternalSiteLink>
                    .
                  </>
                }
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24 items-center mb-16 md:mb-32">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 flex flex-col gap-8 site-copy"
              >
                <p>
                  Forged in the creative crucibles of Toronto's
                  digital advertising scene in 2005,{" "}
                  <ExternalSiteLink href="https://gorfmusic.com">
                    Gorf
                  </ExternalSiteLink>{" "}
                  (Designer/Developer) and{" "}
                  <ExternalSiteLink href="https://tohuxtable.bandcamp.com/">
                    Hux
                  </ExternalSiteLink>{" "}
                  (Copywriter)
                  discovered a shared sonic vision that would
                  eventually birth SSATCY. What began as
                  late-night discourse analyzing the visceral
                  pulse of hip-hop and the ethereal textures of
                  downtempo and jungle blossomed into a prolific
                  creative partnership by 2010.
                </p>
                <p>
                  Eventually commandeering a shared studio on
                  Audley Avenue, adjacent to the Mimico GO
                  station in Toronto's West End, the duo began
                  translating their myriad influences into an
                  uncompromising amalgamation of sound.
                </p>
                <p>
                  Their early sessions were characterized by an
                  obsession with analogue warmth, rhythmic
                  complexity, and an unapologetic defiance of
                  genre boundaries. Drawing deeply from hip-hop
                  cadence and infusing it with lush soundscapes
                  with worldly inspiration, SSATCY cultivated an
                  auditory aesthetic that is at once intimate
                  and sprawling.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 relative group cursor-crosshair"
              >
                {/* Vibrant full color image for Bio per rules */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="relative border border-white/10 p-4 bg-zinc-900/70 transform md:rotate-2 group-hover:rotate-0 transition-all duration-700 z-10 shadow-2xl"
                >
                  <img
                    src={FEATURE_IMAGES.bio}
                    alt="Portrait of Gorf and T.O Huxtable in their early days"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
                <div
                  className="absolute inset-0 border-2 border-yellow-500/30 transform md:-rotate-3 group-hover:-rotate-1 transition-transform duration-700 -z-10 bg-yellow-500/5 translate-x-4 translate-y-4"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* MUSIC SECTION */}
        <section
          id="music"
          className="py-20 md:py-32 bg-black flex items-center justify-center relative overflow-hidden z-20 border-t border-white/5"
        >
          {/* Abstract Background Element */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none z-0 blur-[56px] md:blur-[88px]"
            aria-hidden="true"
          >
            <motion.div
              animate={lowMotionMode ? undefined : { rotate: 360 }}
              transition={{
                duration: 150,
                repeat: lowMotionMode ? 0 : Infinity,
                ease: "linear",
              }}
              className="w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full border border-white/5 border-dashed relative"
            >
              <div className="absolute top-0 left-1/2 w-[800px] md:w-[1200px] h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent -translate-x-1/2" />
              <div className="absolute left-0 top-1/2 h-[800px] md:h-[1200px] w-px bg-gradient-to-b from-transparent via-yellow-500/50 to-transparent -translate-y-1/2" />
            </motion.div>
          </motion.div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SectionIntro
                icon={
                  <Disc
                    className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 shrink-0"
                    aria-hidden="true"
                  />
                }
                title="Discography"
                titleAdornment={
                  <div className="flex items-center gap-4 sm:ml-6 mt-2 sm:mt-0">
                    <div
                      className="h-px bg-gradient-to-r from-transparent to-green-500/50 w-16"
                      aria-hidden="true"
                    />
                    <span className="text-yellow-500 text-sm font-bold tracking-[0.3em] uppercase whitespace-nowrap">
                      Coming Soon
                    </span>
                    <div
                      className="h-px bg-gradient-to-l from-transparent to-red-500/50 w-16"
                      aria-hidden="true"
                    />
                  </div>
                }
                description={
                  <>
                    The SSATCY sonic archive is currently being
                    mastered. Prepare for an uncompromising
                    amalgamation of subterranean bass, ethereal
                    downtempo, and structural precision.
                  </>
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-start"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("live")}
                className="w-full sm:w-auto px-6 py-4 md:px-10 md:py-5 bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500/50 rounded-sm shadow-xl"
              >
                View Live Dates
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* FILM SECTION (Gritty muting to color hover) */}
        <section
          id="film"
          className="py-20 md:py-32 bg-black relative overflow-hidden z-20 border-t border-white/5"
        >
          <motion.div
            className="absolute top-0 right-0 w-[min(140vw,56rem)] h-[min(140vw,56rem)] md:w-[64rem] md:h-[64rem] bg-red-600/[0.045] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/4 z-0 blur-[96px] md:blur-[128px]"
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[min(140vw,56rem)] h-[min(140vw,56rem)] md:w-[64rem] md:h-[64rem] bg-green-600/[0.045] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4 z-0 blur-[96px] md:blur-[128px]"
            aria-hidden="true"
          />

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SectionIntro
                icon={
                  <Film
                    className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 shrink-0"
                    aria-hidden="true"
                  />
                }
                title="Film Scoring & Foley"
                description={
                  <>
                    Crafting auditory architecture for narrative
                    cinema. From evocative musical scores to
                    meticulous foley recording and sound design,
                    our production brings scenes to life with
                    unparalleled structural precision.
                  </>
                }
              />
            </motion.div>

            <FeaturedMediaCard
              layout="image-start"
              imageSrc={FEATURE_IMAGES.filmPrimary}
              imageAlt="Tapped film poster artwork"
              title="Tapped"
              contentAccent="red"
              imageBadge={
                <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 bg-black/80 px-4 py-2 border border-white/10 rounded-full text-yellow-500">
                  <Trophy className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Award Winning
                  </span>
                </div>
              }
              meta={
                <>
                  <span className="text-zinc-300">November 2015</span>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                    aria-hidden="true"
                  />
                  <span className="text-zinc-300">
                    Toronto 50 Hour Film Festival
                  </span>
                </>
              }
            >
              <p className="site-copy-muted mb-8 md:mb-10">
                Winner of the "Best Film" award at Toronto's 50 Hour Film
                Festival. We composed the complete original score and handled
                all Foley recording and production under an extreme deadline,
                delivering a tense, atmospheric soundtrack that anchored the
                film's narrative momentum. The project showcases our ability to
                rapidly conceptualize and execute professional-grade auditory
                landscapes.
              </p>
            </FeaturedMediaCard>

            <FeaturedMediaCard
              layout="image-end"
              imageSrc={FEATURE_IMAGES.filmSecondary}
              imageAlt="Unit 5 comic artwork panel"
              title="Unit 5 Pilot"
              contentAccent="green"
              meta={
                <>
                  <span className="text-zinc-300">July 2014</span>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-zinc-300">Dir. Brian Faraldo</span>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-zinc-300">Collab. Skip Winter</span>
                </>
              }
            >
              <p className="site-copy-muted mb-8 md:mb-10">
                We had the distinct privilege of scoring and managing the
                complete Foley recording and production for the Unit 5 pilot,
                directed by our client Brian Faraldo and executed in
                collaboration with Skip Winter. The piece was meticulously
                crafted for review on Kevin Smith's Smodcast Internet
                Television, requiring a professional and resonant soundscape that
                matched the caliber of its intended platform.
              </p>
            </FeaturedMediaCard>
          </div>
        </section>

        {/* GAMES SECTION */}
        <section
          id="games"
          className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden z-20 border-t border-white/5"
        >
          <motion.div
            className="absolute -inset-[35%] bg-gradient-to-br from-green-600/[0.04] via-transparent to-transparent pointer-events-none blur-[80px] md:blur-[110px]"
            aria-hidden="true"
          />

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SectionIntro
                icon={
                  <Gamepad2
                    className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 shrink-0"
                    aria-hidden="true"
                  />
                }
                title="Game Soundtracks"
                description={
                  <>
                    Dynamic, adaptive sonic environments engineered for digital
                    immersion. Bringing character, momentum, and impact to
                    interactive experiences.
                  </>
                }
              />
            </motion.div>

            <FeaturedMediaCard
              layout="image-start"
              imageSrc={FEATURE_IMAGES.gamesPrimary}
              imageAlt="KnickKnack promotional artwork"
              title="KnickKnack"
              contentAccent="green"
              meta={
                <>
                  <span className="text-zinc-300">December 2013</span>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-zinc-300">Relish Interactive</span>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-zinc-300">Some Assembly Required</span>
                </>
              }
            >
              <p className="site-copy-muted mb-8 md:mb-10">
                We engineered the complete soundtrack and audio package for
                "KnickKnack", the interactive spin-off game supporting the hit
                television series "Some Assembly Required". Our work focused on
                capturing the show's kinetic energy while providing a looping,
                non-fatiguing auditory backdrop suitable for extended gameplay
                sessions.
              </p>
            </FeaturedMediaCard>
          </div>
        </section>

        {/* LIVE EVENTS SECTION */}
        <section
          id="live"
          className="py-20 md:py-32 bg-zinc-950 relative overflow-hidden z-20 border-t border-white/5"
        >
          {/* Abstract Background Elements */}
          <motion.div
            className="absolute top-[10%] -right-[20%] w-[min(130vw,52rem)] h-[min(130vw,52rem)] md:w-[60rem] md:h-[60rem] bg-red-600/[0.04] rounded-full pointer-events-none blur-[96px] md:blur-[128px]"
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-[10%] -left-[20%] w-[min(130vw,52rem)] h-[min(130vw,52rem)] md:w-[60rem] md:h-[60rem] bg-yellow-500/[0.04] rounded-full pointer-events-none blur-[96px] md:blur-[128px]"
            aria-hidden="true"
          />

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SectionIntro
                icon={
                  <Activity
                    className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 shrink-0"
                    aria-hidden="true"
                  />
                }
                title="Live & DJ Sets"
                description={
                  <>
                    Experience the visceral energy of SSATCY in the physical
                    realm. From intimate underground DJ sets to live public
                    addresses and festival performances.
                  </>
                }
              />
            </motion.div>

            <HandlebarEventCard />

            {/* Upcoming Dates */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest">
                  Upcoming Transmissions
                </h3>
                <div
                  className="w-2.5 h-2.5 rounded-full bg-red-500"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-4">
                {UPCOMING_EVENTS.length > 0 ? (
                  UPCOMING_EVENTS.map((event, i) => (
                    <motion.article
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={clsx(
                        "group relative touch-manipulation overflow-hidden border transition-all duration-300 [-webkit-tap-highlight-color:transparent]",
                        event.isSoldOut
                          ? "border-white/5 bg-zinc-900/20 opacity-70"
                          : "border-white/10 bg-zinc-900/50 hover:border-yellow-500/50 hover:bg-zinc-900 active:border-yellow-500/50 active:bg-zinc-900",
                      )}
                    >
                      <div
                        className={clsx(
                          "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
                          event.isSoldOut
                            ? "bg-zinc-600"
                            : "bg-yellow-500 group-hover:bg-yellow-400 group-active:bg-yellow-400",
                        )}
                        aria-hidden="true"
                      />

                      <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 ml-1">
                        <div className="flex items-center gap-6 min-w-[120px] md:min-w-[140px] border-b md:border-b-0 border-white/10 pb-4 md:pb-0">
                          <div className="text-left md:text-center flex flex-row md:flex-col items-baseline md:items-center gap-3 md:gap-0">
                            <div className="text-yellow-500 text-sm font-black tracking-widest md:mb-1">
                              {event.date.split(" ")[0]}
                            </div>
                            <div className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">
                              {event.date.split(" ")[1]}
                            </div>
                            <div className="text-sm font-bold text-zinc-500 md:mt-2">
                              {event.year}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 mt-4 md:mt-0">
                          <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide mb-3 flex flex-wrap items-center gap-2 md:gap-4">
                            {event.venue}
                            {event.isSoldOut && (
                              <span className="text-[10px] px-3 py-1 border border-zinc-500 text-zinc-500 rounded-full font-bold">
                                SOLD OUT
                              </span>
                            )}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-zinc-400 font-light">
                            <span className="flex items-center gap-2">
                              <MapPin
                                className="w-5 h-5"
                                aria-hidden="true"
                              />{" "}
                              {event.location}
                            </span>
                            <span
                              className="w-1.5 h-1.5 bg-zinc-600 rounded-full"
                              aria-hidden="true"
                            />
                            <span className="text-yellow-500 uppercase tracking-widest text-xs font-black">
                              {event.type}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0">
                          <button
                            type="button"
                            disabled={event.isSoldOut}
                            className={clsx(
                              "w-full md:w-auto px-6 py-4 md:px-10 md:py-5 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 rounded-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50",
                              event.isSoldOut
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                : "bg-white text-black hover:bg-yellow-500",
                            )}
                          >
                            {event.isSoldOut
                              ? "Unavailable"
                              : "Tickets"}
                            {!event.isSoldOut && (
                              <ExternalLink
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 md:py-20 text-center border border-white/10 bg-zinc-900/30 rounded-sm shadow-inner"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border border-white/5 mb-8 shadow-xl">
                      <Calendar
                        className="w-8 h-8 text-yellow-500/50"
                        aria-hidden="true"
                      />
                    </div>
                    <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-4">
                      Transmissions Paused
                    </h4>
                    <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-zinc-500 md:text-xl">
                      No upcoming shows are currently scheduled.
                      Stay tuned to our channels for future live
                      appearances and studio updates.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Past Dates — skip first row when it is featured in HandlebarEventCard above */}
            {PAST_EVENTS.length > 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 md:mt-32"
              >
                <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
                  <h3 className="text-lg md:text-xl font-bold text-zinc-500 uppercase tracking-widest">
                    Archive & Past Sets
                  </h3>
                  <Calendar
                    className="w-6 h-6 text-zinc-500"
                    aria-hidden="true"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {PAST_EVENTS.slice(1).map((event, i) => (
                    <motion.article
                      key={`${event.date}-${event.year}-${event.venue}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(24, 24, 27, 0.8)",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                      className="group touch-manipulation flex cursor-pointer flex-col justify-between gap-4 border border-white/5 bg-zinc-900/20 p-6 text-zinc-400 transition-colors [-webkit-tap-highlight-color:transparent] sm:flex-row sm:items-center md:gap-0 md:p-8"
                    >
                      <div>
                        <div className="mb-2 text-sm font-black uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-yellow-500/70 group-active:text-yellow-500/70">
                          {event.date}, {event.year}
                        </div>
                        <div className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-yellow-500 group-active:text-yellow-500 md:text-2xl">
                          {event.eventName ?? event.venue}
                        </div>
                        {event.eventName ? (
                          <div className="text-sm md:text-base font-semibold text-zinc-400 mb-2">
                            {event.venue}
                          </div>
                        ) : null}
                        <div className="text-sm flex flex-wrap items-center gap-3">
                          <span>{event.location}</span>
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-zinc-700 transition-colors group-hover:bg-yellow-500/50 group-active:bg-yellow-500/50"
                            aria-hidden="true"
                          />
                          <span className="text-yellow-500/80 font-bold uppercase tracking-widest text-xs">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </div>
        </section>

        {/* GALLERY SECTION — grayscale by default; color on hover / active (tap) */}
        <section
          id="gallery"
          className="py-20 md:py-32 bg-black relative overflow-hidden z-20 border-t border-white/5"
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center opacity-[0.09] pointer-events-none z-0 mt-16 md:mt-32 blur-[72px] md:blur-[100px]"
          >
            <motion.div
              animate={lowMotionMode ? undefined : { scale: [1, 1.05, 1] }}
              transition={{
                duration: 15,
                repeat: lowMotionMode ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] rounded-full border-2 border-white/5 border-dashed relative"
              aria-hidden="true"
            >
              <div className="absolute inset-8 rounded-full border border-white/5" />
              <div className="absolute inset-20 rounded-full border border-white/5 border-dashed" />
            </motion.div>
          </motion.div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SectionIntro
                icon={
                  <Camera
                    className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 shrink-0"
                    aria-hidden="true"
                  />
                }
                title="Visual Archive"
                description={
                  <>
                    Compiled from analog film rolls and late-night gig archives.
                    Standalone moments from the studio.
                  </>
                }
              />
            </motion.div>

            {/* sequential: round-robin columns so order matches GALLERY_IMAGES */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2 }}
            >
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  350: 1,
                  750: 2,
                  1024: 3,
                }}
              >
                <Masonry gutter="1.5rem" sequential>
                  {GALLERY_IMAGES.map((img, i) => (
                    <motion.div
                      key={img.src}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: (i % 3) * 0.1 }}
                      className="group touch-manipulation rounded-sm border border-white/10 bg-zinc-900 p-2 shadow-xl [-webkit-tap-highlight-color:transparent]"
                    >
                      <div className="relative overflow-hidden bg-black">
                        <span className="photo-grayscale-thumb">
                          <img
                            src={img.src}
                            alt={img.alt}
                            className="h-auto w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
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
                A sonic amalgamation of hip-hop, downtempo,
                jungle, and world music, originating from
                Toronto's West End. Uncompromising production
                meeting immersive storytelling.
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
                  Available for sync licensing, live
                  performances, DJ sets, or brand collaborations
                  globally.
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
    </div>
  );
}