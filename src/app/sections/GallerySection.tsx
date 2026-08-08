import { motion } from "motion/react";
import { Camera } from "lucide-react";
import Masonry, {
  ResponsiveMasonry,
} from "react-responsive-masonry";
import { SectionIntro } from "../components/SectionIntro";
import { GALLERY_IMAGES } from "../content";

type GallerySectionProps = {
  lowMotionMode: boolean;
};

export function GallerySection({ lowMotionMode }: GallerySectionProps) {
  return (
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
                Photographs from the studio and the stage, with a little
                Toronto life in between.
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
                        srcSet={img.srcSet}
                        sizes="(max-width: 749px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        width={img.width}
                        height={img.height}
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
  );
}
