import { motion } from "motion/react";
import { Disc } from "lucide-react";
import { SectionIntro } from "../components/SectionIntro";

type MusicSectionProps = {
  lowMotionMode: boolean;
  scrollToSection: (id: string) => void;
};

export function MusicSection({
  lowMotionMode,
  scrollToSection,
}: MusicSectionProps) {
  return (
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
                The first SSATCY releases are in the final stages
                of mastering. They carry deep bass, unhurried
                atmosphere, and rhythms shaped down to the
                smallest turn.
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
            See Live Dates
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
