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
  // The bottle picture (a perfume bottle filled with the family's ingredients) the homepage scroller shows. Families
  // with no bottle of their own borrow the closest one, so a few share a picture.
  bottle: string;
}

export const FRAGRANCE_FAMILIES: FragranceFamily[] = [
  { name: "Aromatic", image: "/fragrance-families/aromatic.png", bottle: "/fragrance-bottles/aromatic.png" },
  { name: "Aromatic Aquatic", image: "/fragrance-families/aromatic-aquatic.png", bottle: "/fragrance-bottles/aromatic-aquatic.png" },
  { name: "Aromatic Fougere", image: "/fragrance-families/aromatic-fougere.png", bottle: "/fragrance-bottles/aromatic-fougere.png" },
  { name: "Aromatic Fruity", image: "/fragrance-families/aromatic-fruity.png", bottle: "/fragrance-bottles/fresh-fruity.png" },
  { name: "Aromatic Green", image: "/fragrance-families/aromatic-green.png", bottle: "/fragrance-bottles/aromatic.png" },
  { name: "Aromatic Spicy", image: "/fragrance-families/aromatic-spicy.png", bottle: "/fragrance-bottles/aromatic-spicy.png" },
  { name: "Chypre", image: "/fragrance-families/chypre.png", bottle: "/fragrance-bottles/chypre.png" },
  { name: "Chypre Floral", image: "/fragrance-families/chypre-floral.png", bottle: "/fragrance-bottles/chypre.png" },
  { name: "Chypre Fruity", image: "/fragrance-families/chypre-fruity.png", bottle: "/fragrance-bottles/fruity.png" },
  { name: "Citrus Aromatic", image: "/fragrance-families/citrus-aromatic.png", bottle: "/fragrance-bottles/citrus-aromatic.png" },
  { name: "Floral", image: "/fragrance-families/floral.png", bottle: "/fragrance-bottles/floral.png" },
  { name: "Floral Aquatic", image: "/fragrance-families/floral-aquatic.png", bottle: "/fragrance-bottles/floral-aquatic.png" },
  { name: "Floral Fruity", image: "/fragrance-families/floral-fruity.png", bottle: "/fragrance-bottles/fruity.png" },
  { name: "Floral Fruity Gourmand", image: "/fragrance-families/floral-fruity-gourmand.png", bottle: "/fragrance-bottles/floral-fruity-gourmand.png" },
  { name: "Floral Woody", image: "/fragrance-families/floral-woody.png", bottle: "/fragrance-bottles/floral-woody-musk.png" },
  { name: "Floral Woody Musk", image: "/fragrance-families/floral-woody-musk.png", bottle: "/fragrance-bottles/floral-woody-musk.png" },
  { name: "Fresh", image: "/fragrance-families/fresh.png", bottle: "/fragrance-bottles/citrus-aromatic.png" },
  { name: "Fresh Fruity", image: "/fragrance-families/fresh-fruity.png", bottle: "/fragrance-bottles/fresh-fruity.png" },
  { name: "Fresh Spicy", image: "/fragrance-families/fresh-spicy.png", bottle: "/fragrance-bottles/fresh-spicy.png" },
  { name: "Fruity", image: "/fragrance-families/fruity.png", bottle: "/fragrance-bottles/fruity.png" },
  { name: "Leather", image: "/fragrance-families/leather.png", bottle: "/fragrance-bottles/leather.png" },
  { name: "Oriental", image: "/fragrance-families/oriental.png", bottle: "/fragrance-bottles/oriental.png" },
  { name: "Oriental Floral", image: "/fragrance-families/oriental-floral.png", bottle: "/fragrance-bottles/oriental-floral.png" },
  { name: "Oriental Fougere", image: "/fragrance-families/oriental-fougere.png", bottle: "/fragrance-bottles/oriental-fougere.png" },
  { name: "Oriental Spicy", image: "/fragrance-families/oriental-spicy.png", bottle: "/fragrance-bottles/oriental-spicy.png" },
  { name: "Oriental Vanilla", image: "/fragrance-families/oriental-vanilla.png", bottle: "/fragrance-bottles/oriental-vanilla.png" },
  { name: "Oriental Woody", image: "/fragrance-families/oriental-woody.png", bottle: "/fragrance-bottles/oriental-woody.png" },
  { name: "Powdery", image: "/fragrance-families/powdery.png", bottle: "/fragrance-bottles/powdery.png" },
  { name: "Tropical Fruity", image: "/fragrance-families/tropical-fruity.png", bottle: "/fragrance-bottles/tropical-fruity.png" },
  { name: "Vanilla", image: "/fragrance-families/vanilla.png", bottle: "/fragrance-bottles/vanilla.png" },
  { name: "Warm Spicy", image: "/fragrance-families/warm-spicy.png", bottle: "/fragrance-bottles/warm-spicy.png" },
  { name: "Woody", image: "/fragrance-families/woody.png", bottle: "/fragrance-bottles/woody.png" },
  { name: "Woody Aquatic", image: "/fragrance-families/woody-aquatic.png", bottle: "/fragrance-bottles/woody-aquatic.png" },
  { name: "Woody Aromatic", image: "/fragrance-families/woody-aromatic.png", bottle: "/fragrance-bottles/woody-aromatic.png" },
  { name: "Woody Floral", image: "/fragrance-families/woody-floral.png", bottle: "/fragrance-bottles/woody-aromatic.png" },
  { name: "Woody Floral Musk", image: "/fragrance-families/woody-floral-musk.png", bottle: "/fragrance-bottles/floral-woody-musk.png" },
  { name: "Woody Spicy", image: "/fragrance-families/woody-spicy.png", bottle: "/fragrance-bottles/woody-spicy.png" },
];
