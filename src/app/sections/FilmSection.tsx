import { motion } from "motion/react";
import { Film, Trophy } from "lucide-react";
import { FeaturedMediaCard } from "../components/FeaturedMediaCard";
import { SectionIntro } from "../components/SectionIntro";
import { FEATURE_IMAGES } from "../content";

export function FilmSection() {
  return (
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
                A picture can tell you where you are. Sound tells
                you how it feels. SSATCY creates original scores,
                foley, and sound design that give stories texture,
                tension, and a pulse of their own.
              </>
            }
          />
        </motion.div>

        <FeaturedMediaCard
          layout="image-start"
          image={FEATURE_IMAGES.filmPrimary}
          imageAlt="Tapped film poster artwork"
          title="Tapped"
          contentAccent="red"
          imageBadge={
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 bg-black/80 px-4 py-2 border border-white/10 rounded-full text-yellow-500">
              <Trophy className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Best Film Winner
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
            Tapped won Best Film at the Toronto 50 Hour Film Festival in
            2015. With the clock already running, we wrote the full original
            score and recorded and produced every foley cue. The finished
            soundtrack builds tension without crowding the story, and proves
            how quickly a clear musical idea can become a finished world.
          </p>
        </FeaturedMediaCard>

        <FeaturedMediaCard
          layout="image-end"
          image={FEATURE_IMAGES.filmSecondary}
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
            For Brian Faraldo&apos;s Unit 5 pilot, we composed the score and
            led the full foley recording and production in collaboration
            with Skip Winter. The pilot was prepared for review by Kevin
            Smith&apos;s Smodcast Internet Television. Our job was to give
            its comic-book energy a sound with weight, movement, and its own
            identity.
          </p>
        </FeaturedMediaCard>
      </div>
    </section>
  );
}
