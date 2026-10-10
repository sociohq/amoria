import { Suspense } from "react";
import { TrackOrder } from "@/components/TrackOrder";

export const metadata = {
  title: "Track Your Order",
  description: "Follow your Amoria parcel with its tracking number.",
};

export default function TrackPage() {
  return (
    // TrackOrder reads ?awb= from the URL (the link in the shipping email), which needs a Suspense boundary.
    <Suspense>
      <TrackOrder />
    </Suspense>
  );
}
