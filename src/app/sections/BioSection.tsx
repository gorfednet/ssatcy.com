import { motion } from "motion/react";
import { Users } from "lucide-react";
import { ExternalSiteLink } from "../components/ExternalSiteLink";
import { SectionIntro } from "../components/SectionIntro";
import { FEATURE_IMAGES } from "../content";

export function BioSection() {
  return (
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
                Sunshine Sneeze and the Contagious Yawn, better
                known as SSATCY, is the long-running musical
                collaboration between{" "}
                <ExternalSiteLink href="https://gorfmusic.com">
                  Gorf
                </ExternalSiteLink>{" "}
                and{" "}
                <ExternalSiteLink href="https://tohuxtable.bandcamp.com/">
                  T.O Huxtable
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
              Gorf and Hux met in Toronto&apos;s digital
              advertising world in 2005. Gorf worked in design
              and development; Hux worked in copy. The real
              conversation started after hours: hip-hop drums,
              the hazy pull of downtempo, the pressure and release
              of jungle. By 2010, those late-night debates had
              become SSATCY.
            </p>
            <p>
              They set up a shared studio on Audley Avenue, close
              enough to Mimico GO to hear trains thread through
              Toronto&apos;s West End. It became a place to follow
              ideas without asking which genre they belonged to.
            </p>
            <p>
              The early sessions chased analogue warmth, intricate
              rhythm, and room for a track to breathe. Hip-hop
              supplied the backbone. Sounds from farther afield
              widened the frame. The result is music that can feel
              close enough for headphones and large enough for a
              screen, a room, or a stage.
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
                src={FEATURE_IMAGES.bio.src}
                srcSet={FEATURE_IMAGES.bio.srcSet}
                sizes="(min-width: 1024px) 42vw, 100vw"
                width={FEATURE_IMAGES.bio.width}
                height={FEATURE_IMAGES.bio.height}
                alt="Early portrait of Gorf and T.O Huxtable under warm orange light"
                loading="lazy"
                decoding="async"
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
  );
}
