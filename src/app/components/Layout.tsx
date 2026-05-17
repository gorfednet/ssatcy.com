import { Link, Outlet, useLocation } from "react-router";
import { Menu, X, Disc, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Biography", path: "/biography" },
  { name: "Music", path: "/music" },
  { name: "Films", path: "/films" },
  { name: "Games", path: "/games" },
  { name: "Gallery", path: "/gallery" },
  { name: "Events", path: "/events" },
  { name: "Links", path: "/links" },
];

export function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-yellow-500/30 selection:text-yellow-200 overflow-x-hidden">
      {/* Premium Header */}
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "py-4" : "py-6"
        )}
      >
        <div 
          className={clsx(
            "absolute inset-0 transition-opacity duration-500 border-b",
            isScrolled ? "opacity-100 bg-zinc-950/80 backdrop-blur-xl border-white/5" : "opacity-0 border-transparent"
          )} 
        />
        <div 
          className={clsx(
            "absolute inset-0 transition-opacity duration-500 bg-gradient-to-b from-black/80 to-transparent pointer-events-none",
            isScrolled ? "opacity-0" : "opacity-100"
          )} 
        />
        <div className="relative z-10 container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="relative w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full overflow-hidden border border-white/10 group-hover:border-yellow-500/50 transition-colors">
              <Disc className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
              {/* Subtle Jamaican accent lines */}
              <div className="absolute inset-x-0 bottom-0 h-1 flex">
                <div className="flex-1 bg-green-600/50" />
                <div className="flex-1 bg-yellow-500/50" />
                <div className="flex-1 bg-red-600/50" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-widest text-white uppercase leading-none">
                SSATCY
              </span>
              <span className="text-[0.55rem] sm:text-[0.6rem] text-zinc-500 tracking-[0.15em] uppercase leading-none mt-1 group-hover:text-zinc-300 transition-colors truncate max-w-[200px] sm:max-w-none">
                Sunshine Sneeze & The Contagious Yawn
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "text-sm font-medium tracking-widest uppercase transition-colors relative",
                    isActive ? "text-yellow-500" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-yellow-500"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden relative z-50 p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-3xl flex flex-col pt-32 px-6 pb-6"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={clsx(
                      "text-2xl font-light tracking-widest uppercase transition-colors block",
                      location.pathname === link.path ? "text-yellow-500" : "text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex items-center gap-6 border-t border-white/10 pt-6">
              <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-yellow-500 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-zinc-950/50 backdrop-blur-md pt-16 md:pt-20 pb-8 md:pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-24 mb-16">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-full border border-white/10">
                  <Disc className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-lg font-bold tracking-widest text-white uppercase leading-none">
                  SSATCY
                </span>
              </Link>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Sunshine Sneeze and the Contagious Yawn. A sonic amalgamation of hip-hop, downtempo, jungle, and world music, originating from Toronto's West End.
              </p>
            </div>

            <div>
              <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6">
                Management & Inquiries
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:management@ssatcy.com"
                    className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                    management@ssatcy.com
                  </a>
                </li>
                <li className="text-zinc-500 text-sm mt-4">
                  For sync licensing, live performances, DJ sets, or brand collaborations.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-6">
                Connect
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-500 hover:text-black transition-all text-zinc-400"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-500 hover:text-black transition-all text-zinc-400"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-500 hover:text-black transition-all text-zinc-400"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-xs uppercase tracking-widest">
              &copy; {new Date().getFullYear()} SSATCY. All Rights Reserved.
            </p>
            <div className="flex gap-1 h-1 w-24">
              <div className="flex-1 bg-green-600/30" />
              <div className="flex-1 bg-yellow-500/30" />
              <div className="flex-1 bg-red-600/30" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
