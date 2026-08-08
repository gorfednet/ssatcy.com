import bioImage from "../assets/images/905a87e3a953527b690448dc7f96e3c3c0084d12.png";
import img2 from "../assets/images/9e419ee32b8903e8fa15cc163610381b02a3dfdc.jpg";
import img3 from "../assets/images/b78e566ee55cc388d3a670e9c395fcd4dd706bf3.jpg";
import img4 from "../assets/images/a809402786d6acbe4e6000f008ff37edfa1c446b.jpg";
import img6 from "../assets/images/52f6c1ed18b31900c07429e3394a1d7fb800c9ec.jpg";
import img7 from "../assets/images/85e2cb36f2ea69b70ef34514d6958f2e4194276d.jpg";
import img9 from "../assets/images/5cb832c12d1b9d3307272010eb5a651c5164a8f8.png";
import unit5Comic from "../assets/images/unit5-comic.png";
import tappedPoster from "../assets/images/tapped-poster.png";
import knickknackPoster from "../assets/images/knickknack-poster.png";
import niteComfort10Handlebar from "../assets/images/nite-comfort-10-handlebar-2014.jpg";
import niteComfort10Flyer from "../assets/images/nite-comfort-10-flyer.jpg";

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

export type GalleryImage = {
  src: string;
  alt: string;
};

export type SocialProfile = {
  name: "instagram" | "twitter" | "youtube";
  href: string;
  ariaLabel: string;
  accent: "green" | "yellow" | "red";
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
  flyerSrc: niteComfort10Flyer,
  flyerAlt:
    "Promotional flyer for Nite Comfort 10: textured brown and grey background; event title Nite Comfort 10; performers 0=0, SSATCY, and Theatreblack; Sunday July 6 at Handlebar, 159 Augusta Avenue, Toronto; pay what you can.",
  addressLine: "159 Augusta Avenue",
  admissionShort: "Pay what you can (PWYC)",
  /** Readable date line for the card (matches the flyer). */
  displayDateLine: "Sunday, July 6, 2014",
} as const;

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: img2,
    alt: "Gorf working at a mixing console surrounded by keyboards and studio monitors",
  },
  {
    src: img3,
    alt: "Overhead view of Hux working at a late-night studio session",
  },
  {
    src: img6,
    alt: "SSATCY studio with keyboards, turntables, drum pads, and monitors",
  },
  {
    src: img4,
    alt: "Gorf adjusting a stacked wall of synthesizers in the studio",
  },
  {
    src: img7,
    alt: "Hux cueing a record on turntables while wearing headphones",
  },
  {
    src: niteComfort10Handlebar,
    alt: "Live at Nite Comfort 10, Handlebar, Toronto, July 6, 2014",
  },
  {
    src: img9,
    alt: "Hux and Gorf in personalized Toronto Maple Leafs jerseys outside a red garage",
  },
];

export const FEATURE_IMAGES = {
  bio: bioImage,
  filmPrimary: tappedPoster,
  filmSecondary: unit5Comic,
  gamesPrimary: knickknackPoster,
};

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com",
  twitter: "https://x.com",
  youtube: "https://youtube.com",
};

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    name: "instagram",
    href: SOCIAL_LINKS.instagram,
    ariaLabel: "Instagram profile",
    accent: "green",
  },
  {
    name: "twitter",
    href: SOCIAL_LINKS.twitter,
    ariaLabel: "X (Twitter) profile",
    accent: "yellow",
  },
  {
    name: "youtube",
    href: SOCIAL_LINKS.youtube,
    ariaLabel: "YouTube channel",
    accent: "red",
  },
];
