import garage640 from "../assets/images/generated/garage-640.webp";
import garage768 from "../assets/images/generated/garage-768.webp";
import hero480 from "../assets/images/generated/hero-480.webp";
import hero768 from "../assets/images/generated/hero-768.webp";
import knickknack640 from "../assets/images/generated/knickknack-poster-640.webp";
import knickknack1024 from "../assets/images/generated/knickknack-poster-1024.webp";
import niteComfortFlyer640 from "../assets/images/generated/nite-comfort-flyer-640.webp";
import niteComfortFlyer954 from "../assets/images/generated/nite-comfort-flyer-954.webp";
import niteComfortLive640 from "../assets/images/generated/nite-comfort-live-640.webp";
import niteComfortLive960 from "../assets/images/generated/nite-comfort-live-960.webp";
import studioConsole640 from "../assets/images/generated/studio-console-640.webp";
import studioConsole960 from "../assets/images/generated/studio-console-960.webp";
import studioOverhead640 from "../assets/images/generated/studio-overhead-640.webp";
import studioOverhead960 from "../assets/images/generated/studio-overhead-960.webp";
import studioRoom640 from "../assets/images/generated/studio-room-640.webp";
import studioRoom960 from "../assets/images/generated/studio-room-960.webp";
import synthWall640 from "../assets/images/generated/synth-wall-640.webp";
import synthWall960 from "../assets/images/generated/synth-wall-960.webp";
import tappedPoster640 from "../assets/images/generated/tapped-poster-640.webp";
import tappedPoster662 from "../assets/images/generated/tapped-poster-662.webp";
import turntables640 from "../assets/images/generated/turntables-640.webp";
import turntables960 from "../assets/images/generated/turntables-960.webp";
import unit5Comic640 from "../assets/images/generated/unit5-comic-640.webp";
import unit5Comic655 from "../assets/images/generated/unit5-comic-655.webp";

export type SectionNavItem = {
  name: string;
  id: string;
};

export type EventItem = {
  date: string;
  year: string;
  venue: string;
  location: string;
  type: string;
  /** Series or night name (e.g. club residency title). */
  eventName?: string;
  isSoldOut?: boolean;
};

export type ResponsiveImage = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
};

export type GalleryImage = ResponsiveImage & {
  alt: string;
};

// Centralizing static content keeps the main component easier to scan
// and makes future CMS/API migration straightforward.
export const NAV_LINKS: SectionNavItem[] = [
  { name: "Home", id: "home" },
  { name: "Bio", id: "bio" },
  { name: "Music", id: "music" },
  { name: "Film", id: "film" },
  { name: "Games", id: "games" },
  { name: "Live", id: "live" },
  { name: "Gallery", id: "gallery" },
];

// Keep this empty when there are no future bookings.
export const UPCOMING_EVENTS: EventItem[] = [];

export const PAST_EVENTS: EventItem[] = [
  {
    date: "JUL 06",
    year: "2014",
    eventName: "Nite Comfort 10",
    venue: "Handlebar",
    location: "Kensington Market, Toronto",
    type: "Live Performance",
  },
];

/** Flyer + copy for the featured Handlebar card on the Live page (matches PAST_EVENTS[0]). */
export const HANDLEBAR_NITE_COMFORT_FEATURE = {
  flyerSrc: niteComfortFlyer954,
  flyerSrcSet: `${niteComfortFlyer640} 640w, ${niteComfortFlyer954} 954w`,
  flyerWidth: 954,
  flyerHeight: 369,
  flyerAlt:
    "Promotional flyer for Nite Comfort 10: textured brown and grey background; event title Nite Comfort 10; performers 0=0, SSATCY, and Theatreblack; Sunday July 6 at Handlebar, 159 Augusta Avenue, Toronto; pay what you can.",
  addressLine: "159 Augusta Avenue",
  admissionShort: "Pay what you can (PWYC)",
  /** Readable date line for the card (matches the flyer). */
  displayDateLine: "Sunday, July 6, 2014",
} as const;

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: studioConsole960,
    srcSet: `${studioConsole640} 640w, ${studioConsole960} 960w`,
    width: 960,
    height: 960,
    alt: "Gorf working at a mixing console surrounded by keyboards and studio monitors",
  },
  {
    src: studioOverhead960,
    srcSet: `${studioOverhead640} 640w, ${studioOverhead960} 960w`,
    width: 960,
    height: 960,
    alt: "Overhead view of Hux working at a late-night studio session",
  },
  {
    src: studioRoom960,
    srcSet: `${studioRoom640} 640w, ${studioRoom960} 960w`,
    width: 960,
    height: 720,
    alt: "SSATCY studio with keyboards, turntables, drum pads, and monitors",
  },
  {
    src: synthWall960,
    srcSet: `${synthWall640} 640w, ${synthWall960} 960w`,
    width: 960,
    height: 538,
    alt: "Gorf adjusting a stacked wall of synthesizers in the studio",
  },
  {
    src: turntables960,
    srcSet: `${turntables640} 640w, ${turntables960} 960w`,
    width: 960,
    height: 960,
    alt: "Hux cueing a record on turntables while wearing headphones",
  },
  {
    src: niteComfortLive960,
    srcSet: `${niteComfortLive640} 640w, ${niteComfortLive960} 960w`,
    width: 960,
    height: 720,
    alt: "Live at Nite Comfort 10, Handlebar, Toronto, July 6, 2014",
  },
  {
    src: garage768,
    srcSet: `${garage640} 640w, ${garage768} 768w`,
    width: 768,
    height: 1024,
    alt: "Hux and Gorf in personalized Toronto Maple Leafs jerseys outside a red garage",
  },
];

export const FEATURE_IMAGES: Record<
  "bio" | "filmPrimary" | "filmSecondary" | "gamesPrimary",
  ResponsiveImage
> = {
  bio: {
    src: hero768,
    srcSet: `${hero480} 480w, ${hero768} 768w`,
    width: 768,
    height: 1024,
  },
  filmPrimary: {
    src: tappedPoster662,
    srcSet: `${tappedPoster640} 640w, ${tappedPoster662} 662w`,
    width: 662,
    height: 1024,
  },
  filmSecondary: {
    src: unit5Comic655,
    srcSet: `${unit5Comic640} 640w, ${unit5Comic655} 655w`,
    width: 655,
    height: 898,
  },
  gamesPrimary: {
    src: knickknack1024,
    srcSet: `${knickknack640} 640w, ${knickknack1024} 1024w`,
    width: 1024,
    height: 570,
  },
};
