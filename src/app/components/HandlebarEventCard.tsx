import * as Dialog from "@radix-ui/react-dialog";
import { MapPin, Maximize2, X } from "lucide-react";
import {
  HANDLEBAR_NITE_COMFORT_FEATURE,
  PAST_EVENTS,
} from "../content";

/**
 * Full-width featured card for the Handlebar / Nite Comfort 10 show, with an accessible
 * lightbox (Radix Dialog) to view the flyer at full resolution.
 */
export function HandlebarEventCard() {
  const event = PAST_EVENTS[0];
  if (!event?.eventName) {
    return null;
  }

  const {
    flyerSrc,
    flyerAlt,
    addressLine,
    admissionShort,
    displayDateLine,
  } = HANDLEBAR_NITE_COMFORT_FEATURE;

  const dialogTitleId = "handlebar-flyer-dialog-title";
  const dialogDescId = "handlebar-flyer-dialog-desc";

  return (
    <article
      className="mb-16 w-full overflow-hidden rounded-sm border border-white/10 bg-zinc-900/40 shadow-xl md:mb-20"
      aria-labelledby="handlebar-feature-heading"
    >
      <div className="grid gap-0 md:grid-cols-2 md:gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="relative min-h-[200px] bg-black md:min-h-[280px]">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={`Open full-size flyer for ${event.eventName} at ${event.venue}`}
                className="group touch-manipulation relative flex h-full min-h-[200px] w-full flex-col items-stretch overflow-hidden text-left [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500/90 md:min-h-[280px]"
              >
                <span className="photo-grayscale-thumb relative h-full min-h-[200px] w-full origin-center transition-transform duration-500 ease-out group-hover:scale-[1.02] group-active:scale-[1.02] motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100 md:min-h-[280px]">
                  <img
                    src={flyerSrc}
                    alt=""
                    width={954}
                    height={369}
                    loading="lazy"
                    decoding="async"
                    className="h-full min-h-[200px] w-full object-cover object-center md:min-h-[280px]"
                  />
                </span>
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent md:bg-gradient-to-r"
                  aria-hidden="true"
                />
                <span className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-4 md:justify-start md:p-6">
                  <span className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-zinc-950/95 px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg">
                    <Maximize2
                      className="h-4 w-4 shrink-0 text-yellow-500"
                      aria-hidden="true"
                    />
                    View full flyer
                  </span>
                </span>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[200] bg-black/85 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content
                className="fixed left-[50%] top-[50%] z-[201] max-h-[min(92vh,900px)] w-[min(calc(100vw-1.5rem),56rem)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm border border-white/10 bg-zinc-950 p-3 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-4"
                aria-describedby={dialogDescId}
                aria-labelledby={dialogTitleId}
              >
                <Dialog.Title
                  id={dialogTitleId}
                  className="sr-only"
                >
                  {event.eventName} — full flyer
                </Dialog.Title>
                <Dialog.Description
                  id={dialogDescId}
                  className="sr-only"
                >
                  Full-resolution promotional flyer image. Use the close
                  control to return to the page.
                </Dialog.Description>

                <div className="relative">
                  <img
                    src={flyerSrc}
                    alt={flyerAlt}
                    width={954}
                    height={369}
                    loading="eager"
                    decoding="async"
                    className="mx-auto h-auto max-h-[min(85vh,560px)] w-full object-contain"
                  />
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="absolute right-1 top-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border border-white/20 bg-zinc-950/95 text-zinc-100 shadow-md transition-colors hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 sm:right-2 sm:top-2"
                      aria-label="Close flyer"
                    >
                      <X
                        className="h-5 w-5"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="flex flex-col justify-center border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8 lg:p-10">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-500/90">
            Archive highlight
          </p>
          <h3
            id="handlebar-feature-heading"
            className="mb-4 text-2xl font-black uppercase tracking-tight text-white md:text-3xl lg:text-4xl"
          >
            {event.eventName}
          </h3>
          <p className="site-copy-muted mb-6">
            Original lineup poster for the night SSATCY performed with 0=0 and
            Theatreblack.
          </p>
          <ul className="list-none space-y-3 p-0 text-lg text-zinc-300 md:text-xl">
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="shrink-0 font-bold text-zinc-500 sm:w-36">
                When
              </span>
              <span>{displayDateLine}</span>
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="shrink-0 font-bold text-zinc-500 sm:w-36">
                Where
              </span>
              <span>
                {event.venue}
                <span className="text-zinc-500"> · </span>
                {event.location}
              </span>
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="shrink-0 font-bold text-zinc-500 sm:w-36">
                Address
              </span>
              <span>{addressLine}</span>
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="shrink-0 font-bold text-zinc-500 sm:w-36">
                Admission
              </span>
              <span>{admissionShort}</span>
            </li>
            <li className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="shrink-0 font-bold text-zinc-500 sm:w-36">
                Format
              </span>
              <span className="flex flex-wrap items-center gap-2">
                <MapPin
                  className="h-5 w-5 shrink-0 text-yellow-500/80"
                  aria-hidden="true"
                />
                {event.type}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
