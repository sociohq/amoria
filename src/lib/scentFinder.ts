import { Product } from "./types";

// The "Find Your Scent" chat quiz's question set and the scoring model
// that turns five answers into a ranked shortlist.
//
// This is a soft *scoring* model, not a strict filter — the catalog is
// small and most products are unisex/"Any season", so an AND-filter across
// five fields would often return nothing at all. Every product gets a
// score and the top few are shown regardless, so the quiz always has an
// answer. The occasion → keyword mapping below is a lightweight heuristic
// this quiz uses to rank results, not a factual claim about any product —
// there's no explicit "occasion" field in the catalog to draw it from.

export type QuestionKey = "gender" | "occasion" | "season" | "profile" | "budget";

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  key: QuestionKey;
  prompt: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    key: "gender",
    prompt: "Who is this fragrance for?",
    options: [
      { label: "For Him", value: "him" },
      { label: "For Her", value: "her" },
      { label: "For Everyone", value: "unisex" },
    ],
  },
  {
    key: "occasion",
    prompt: "When will you be wearing it?",
    options: [
      { label: "Daytime", value: "daytime" },
      { label: "Evening", value: "evening" },
      { label: "Anytime", value: "anytime" },
    ],
  },
  {
    key: "season",
    prompt: "Which season are you shopping for?",
    options: [
      { label: "Summer", value: "summer" },
      { label: "Winter", value: "winter" },
      { label: "Spring", value: "spring" },
      { label: "Autumn", value: "autumn" },
    ],
  },
  {
    key: "profile",
    prompt: "Which scent profile appeals to you?",
    options: [
      { label: "Woody & Oud", value: "woody" },
      { label: "Floral", value: "floral" },
      { label: "Fresh & Citrus", value: "fresh" },
      { label: "Warm & Amber", value: "amber" },
    ],
  },
  {
    key: "budget",
    prompt: "What's your budget per bottle?",
    options: [
      { label: "Under AED 200", value: "under200" },
      { label: "AED 200 – 350", value: "200to350" },
      { label: "AED 350+", value: "over350" },
    ],
  },
];

export type QuizAnswers = Partial<Record<QuestionKey, string>>;

const PROFILE_KEYWORDS: Record<string, string[]> = {
  woody: ["oud", "wood", "agarwood", "cognac", "oakmoss", "sandalwood", "olibanum"],
  floral: ["rose", "floral", "jasmine", "lavender", "peony"],
  fresh: ["citrus", "fresh", "fruity", "pineapple", "mango", "bergamot", "tropical"],
  amber: ["amber", "vanilla", "honey", "oriental", "cardamom", "ambergris", "musk"],
};

// Soft ranking bias only — see file header.
const OCCASION_KEYWORDS: Record<string, string[]> = {
  daytime: ["fresh", "citrus", "fruity"],
  evening: ["oriental", "woody", "amber", "oud"],
  anytime: [],
};

function scentBlob(product: Product): string {
  return [product.fragranceFamily ?? "", ...product.scentAccords].join(" ").toLowerCase();
}

function cheapestPrice(product: Product): number {
  if (product.variants.length === 0) return product.price;
  return Math.min(...product.variants.map((v) => v.price));
}

function budgetFits(band: string | undefined, price: number): boolean {
  if (band === "under200") return price <= 200;
  if (band === "200to350") return price > 200 && price <= 350;
  if (band === "over350") return price > 350;
  return true;
}

// Ranks every active product against the given answers and returns the
// top `limit` — never an empty list (as long as products isn't), since a
// hard "no matches" would be a poor result from a five-question quiz over
// a small catalog.
export function matchProducts(products: Product[], answers: QuizAnswers, limit = 3): Product[] {
  // Only real, photographed fragrances are suggested — an accessory or a
  // product still waiting on its photo makes a poor "your perfect scent".
  const candidates = products.filter(
    (p) => p.productType === "PERFUME" && Boolean(p.thumbnailImage ?? p.images[0]?.url)
  );
  const scored = candidates.map((product) => {
    let score = 0;
    const blob = scentBlob(product);
    const categorySlugs = product.categories.map((c) => c.slug);

    if (answers.gender === "him" && categorySlugs.includes("for-him")) score += 3;
    if (answers.gender === "her" && categorySlugs.includes("for-her")) score += 3;
    if (categorySlugs.includes("for-unisex")) score += answers.gender === "unisex" ? 3 : 1.5;

    const profileWords = answers.profile ? PROFILE_KEYWORDS[answers.profile] ?? [] : [];
    if (profileWords.some((w) => blob.includes(w))) score += 3;

    const occasionWords = answers.occasion ? OCCASION_KEYWORDS[answers.occasion] ?? [] : [];
    if (occasionWords.some((w) => blob.includes(w))) score += 1;

    const season = product.season?.toLowerCase() ?? "";
    if (season.includes("any")) score += 1;
    else if (answers.season && season.includes(answers.season)) score += 2;

    if (budgetFits(answers.budget, cheapestPrice(product))) score += 2;
    else score -= 1;

    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.product);
}
