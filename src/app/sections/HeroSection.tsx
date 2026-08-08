import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FEATURE_IMAGES } from "../content";

type HeroSectionProps = {
  scrollToSection: (id: string) => void;
};

export function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
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
        {/* Jamaican accent wash. Heavy blur keeps blobs ambient rather than geometric. */}
        <div className="absolute -bottom-32 left-0 w-[min(100%,48rem)] h-[22rem] md:h-[28rem] bg-yellow-500/[0.07] rounded-full z-10 mix-blend-screen blur-[100px] md:blur-[130px] scale-125" />
        <div className="absolute top-[8%] -right-24 w-[28rem] h-[28rem] md:w-[36rem] md:h-[36rem] bg-red-600/[0.07] rounded-full z-10 mix-blend-screen blur-[100px] md:blur-[130px]" />
        <div className="absolute bottom-[12%] -left-20 w-[26rem] h-[26rem] md:w-[34rem] md:h-[34rem] bg-green-600/[0.07] rounded-full z-10 mix-blend-screen blur-[100px] md:blur-[130px]" />

        {/* Main Hero Background - starts muted, blooms on hover (simulated by group hover on hero or just left as gritty) */}
        <div className="group relative w-full h-full">
          <img
            src={FEATURE_IMAGES.bio.src}
            srcSet={FEATURE_IMAGES.bio.srcSet}
            sizes="100vw"
            width={FEATURE_IMAGES.bio.width}
            height={FEATURE_IMAGES.bio.height}
            alt="Early portrait of Gorf and T.O Huxtable under warm orange light"
            fetchPriority="high"
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
            Toronto, Then Everywhere
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
            How It Started
            <ArrowRight
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
