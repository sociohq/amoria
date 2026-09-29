// The full fragrance-family taxonomy the catalog's products are tagged
// with (Product.fragranceFamily — free text, but every real product uses
// one of these exact names). Powers the homepage's circular "Shop By
// Scent Family" scroller — each entry links to /shop?family=<name>,
// filtered server-side via GET /api/products?fragranceFamily=.
//
// "Floral Woody" has no dedicated icon of its own; it reuses "Woody
// Floral"'s artwork since they're the same accord just reordered, rather
// than inventing a new image for a name that's effectively a duplicate.
export interface FragranceFamily {
  name: string;
  image: string;
}

export const FRAGRANCE_FAMILIES: FragranceFamily[] = [
  { name: "Aromatic", image: "/fragrance-families/aromatic.png" },
  { name: "Aromatic Aquatic", image: "/fragrance-families/aromatic-aquatic.png" },
  { name: "Aromatic Fougere", image: "/fragrance-families/aromatic-fougere.png" },
  { name: "Aromatic Fruity", image: "/fragrance-families/aromatic-fruity.png" },
  { name: "Aromatic Green", image: "/fragrance-families/aromatic-green.png" },
  { name: "Aromatic Spicy", image: "/fragrance-families/aromatic-spicy.png" },
  { name: "Chypre", image: "/fragrance-families/chypre.png" },
  { name: "Chypre Floral", image: "/fragrance-families/chypre-floral.png" },
  { name: "Chypre Fruity", image: "/fragrance-families/chypre-fruity.png" },
  { name: "Citrus Aromatic", image: "/fragrance-families/citrus-aromatic.png" },
  { name: "Floral", image: "/fragrance-families/floral.png" },
  { name: "Floral Aquatic", image: "/fragrance-families/floral-aquatic.png" },
  { name: "Floral Fruity", image: "/fragrance-families/floral-fruity.png" },
  { name: "Floral Fruity Gourmand", image: "/fragrance-families/floral-fruity-gourmand.png" },
  { name: "Floral Woody", image: "/fragrance-families/floral-woody.png" },
  { name: "Floral Woody Musk", image: "/fragrance-families/floral-woody-musk.png" },
  { name: "Fresh", image: "/fragrance-families/fresh.png" },
  { name: "Fresh Fruity", image: "/fragrance-families/fresh-fruity.png" },
  { name: "Fresh Spicy", image: "/fragrance-families/fresh-spicy.png" },
  { name: "Fruity", image: "/fragrance-families/fruity.png" },
  { name: "Leather", image: "/fragrance-families/leather.png" },
  { name: "Oriental", image: "/fragrance-families/oriental.png" },
  { name: "Oriental Floral", image: "/fragrance-families/oriental-floral.png" },
  { name: "Oriental Fougere", image: "/fragrance-families/oriental-fougere.png" },
  { name: "Oriental Spicy", image: "/fragrance-families/oriental-spicy.png" },
  { name: "Oriental Vanilla", image: "/fragrance-families/oriental-vanilla.png" },
  { name: "Oriental Woody", image: "/fragrance-families/oriental-woody.png" },
  { name: "Powdery", image: "/fragrance-families/powdery.png" },
  { name: "Tropical Fruity", image: "/fragrance-families/tropical-fruity.png" },
  { name: "Vanilla", image: "/fragrance-families/vanilla.png" },
  { name: "Warm Spicy", image: "/fragrance-families/warm-spicy.png" },
  { name: "Woody", image: "/fragrance-families/woody.png" },
  { name: "Woody Aquatic", image: "/fragrance-families/woody-aquatic.png" },
  { name: "Woody Aromatic", image: "/fragrance-families/woody-aromatic.png" },
  { name: "Woody Floral", image: "/fragrance-families/woody-floral.png" },
  { name: "Woody Floral Musk", image: "/fragrance-families/woody-floral-musk.png" },
  { name: "Woody Spicy", image: "/fragrance-families/woody-spicy.png" },
];
