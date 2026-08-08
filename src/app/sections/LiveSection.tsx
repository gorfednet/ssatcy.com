import { motion } from "motion/react";
import {
  Activity,
  Calendar,
  ExternalLink,
  MapPin,
} from "lucide-react";
import clsx from "clsx";
import { HandlebarEventCard } from "../components/HandlebarEventCard";
import { SectionIntro } from "../components/SectionIntro";
import { PAST_EVENTS, UPCOMING_EVENTS } from "../content";

export function LiveSection() {
  return (
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
                SSATCY moves between close-quarters DJ sets, live
                performance, and festival stages. Different rooms call for
                different pressure, but the aim stays the same: make the
                music feel immediate.
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
              Upcoming Shows
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
                  Nothing Announced Yet
                </h4>
                <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-zinc-500 md:text-xl">
                  There are no upcoming dates on the calendar.
                  New shows and studio news will appear here
                  when they are ready.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Skip the first past date when HandlebarEventCard features it above. */}
        {PAST_EVENTS.length > 1 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-32"
          >
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
              <h3 className="text-lg md:text-xl font-bold text-zinc-500 uppercase tracking-widest">
                Past Sets
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
  );
}
