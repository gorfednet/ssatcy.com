import { motion } from "motion/react";
import { Gamepad2 } from "lucide-react";
import { FeaturedMediaCard } from "../components/FeaturedMediaCard";
import { SectionIntro } from "../components/SectionIntro";
import { FEATURE_IMAGES } from "../content";

export function GamesSection() {
  return (
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
                Game music has to move with the player and stay rewarding
                long after the first loop. We write soundtracks that carry
                character, pace, and a sense of place into the experience.
              </>
            }
          />
        </motion.div>

        <FeaturedMediaCard
          layout="image-start"
          image={FEATURE_IMAGES.gamesPrimary}
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
            For KnickKnack, Relish Interactive&apos;s game connected to the
            television series Some Assembly Required, we created the
            complete soundtrack and audio package. The music keeps pace with
            the show&apos;s bright, restless energy while leaving enough air
            for repeated play.
          </p>
        </FeaturedMediaCard>
      </div>
    </section>
  );
}
