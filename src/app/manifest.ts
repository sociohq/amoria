import type { MetadataRoute } from "next";

// Lets a phone "Add to Home Screen" with the Amoria icon and colours.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amoria Perfume",
    short_name: "Amoria",
    description: "Luxury perfumes, inspired fragrances and bukhoor, delivered across the UAE.",
    start_url: "/",
    display: "standalone",
    background_color: "#eeeae1",
    theme_color: "#1c1a17",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
