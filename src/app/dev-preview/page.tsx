// TEMPORARY — visual demo only, not connected to real data. Delete once
// a real database is live and this can be seen on the actual homepage.
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { Hero } from "@/components/Hero";
import { Category } from "@/lib/types";

const SAMPLE: Category[] = [
  { id: "1", name: "Inspired Fragrance", slug: "inspired-fragrance", image: "/categories/inspired-fragrance.png" },
  { id: "2", name: "For Her", slug: "for-her", image: "/categories/womens-perfume.png" },
  { id: "3", name: "Amoria Signature", slug: "amoria-signature", image: "/categories/amoria-signature.png" },
];

export default function Preview() {
  return (
    <div>
      <Hero />
      <CategoryShowcase categories={SAMPLE} />
    </div>
  );
}
