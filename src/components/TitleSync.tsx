"use client";

import { useEffect } from "react";

// Keeps the browser-tab title in step with the page being shown. When shoppers click through to a /shop?category=…
// page from elsewhere on the site, Next sometimes keeps the title of a different, pre-loaded category (e.g. the
// New Arrival page showing "Bukhoor"). The server already sends the right title for a fresh load or a share; this
// only corrects that client-side slip.
export function TitleSync({ title }: { title: string }) {
  useEffect(() => {
    if (document.title !== title) document.title = title;
  }, [title]);
  return null;
}
