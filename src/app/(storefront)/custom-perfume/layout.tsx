import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Own Perfume",
  description: "Design a custom perfume: choose your fragrance family, strength and size, made to order by Amoria Perfume.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
