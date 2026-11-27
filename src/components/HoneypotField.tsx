"use client";

import { useId } from "react";

// Off-screen, out of tab order, and hidden from assistive tech. Humans leave
// it empty; a bot that fills every input will not. The value is read from the
// DOM at submit time so a script that sets `.value` directly is still seen.
export function HoneypotField({ ref }: { ref?: React.Ref<HTMLInputElement> }) {
  const id = useId();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip-path:inset(50%)]"
    >
      <label htmlFor={id}>Company fax</label>
      <input
        ref={ref}
        id={id}
        type="text"
        name="company_fax"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        className="h-px w-px border-0 p-0"
      />
    </div>
  );
}
