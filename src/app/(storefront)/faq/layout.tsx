import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about orders, delivery, returns and choosing a fragrance at Amoria Perfume.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
