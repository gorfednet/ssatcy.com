import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Biography } from "./pages/Biography";
import { Music } from "./pages/Music";
import { Films } from "./pages/Films";
import { Games } from "./pages/Games";
import { Gallery } from "./pages/Gallery";
import { Events } from "./pages/Events";
import { Links } from "./pages/Links";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "biography", Component: Biography },
      { path: "music", Component: Music },
      { path: "films", Component: Films },
      { path: "games", Component: Games },
      { path: "gallery", Component: Gallery },
      { path: "events", Component: Events },
      { path: "links", Component: Links },
    ],
  },
]);
