"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { listProducts } from "@/lib/products";
import { formatAed } from "@/lib/money";
import { QUIZ_QUESTIONS, QuizAnswers, matchProducts } from "@/lib/scentFinder";

// Delay before each bot message "arrives", so answering a question reads
// as a reply being typed rather than the next question snapping in.
const TYPING_DELAY_MS = 650;

type Message =
  | { id: string; from: "bot"; kind: "text"; text: string }
  | { id: string; from: "bot"; kind: "results"; products: Product[] }
  | { id: string; from: "user"; text: string };

let nextId = 0;
const id = () => `m${nextId++}`;

const GREETING = "Hi! I'm here to help you find your perfect Amoria scent. Just a few quick questions —";

// The "Find Your Scent" quiz, presented as a chat: the bot asks one
// question at a time (with quick-reply chips instead of free text — this
// is a guided quiz, not open conversation), the visitor's picks appear as
// their own chat bubbles, and the final "bot" message is the curated
// shortlist itself, shown as product cards right there in the thread
// rather than navigating anywhere. Stays mounted (visibility toggled via
// the `open` prop, same pattern as CartDrawer/AuthDrawer) so the
// conversation survives closing and reopening the panel.
export function ScentFinderChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(-1); // -1 = not started yet, QUIZ_QUESTIONS.length = finished
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [typing, setTyping] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetched once, up front, so the results step doesn't stall on a request
  // right when the visitor is expecting an instant answer.
  useEffect(() => {
    listProducts({ limit: 50 })
      .then((r) => setProducts(r.products))
      .catch(() => setProducts([]));
  }, []);

  // Kicks off the conversation the first time the panel is opened — a
  // greeting followed immediately by the first question. Every later
  // question/result is instead posted directly from handleAnswer below,
  // right after the visitor replies.
  useEffect(() => {
    if (open && step === -1 && messages.length === 0) {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setMessages([
          { id: id(), from: "bot", kind: "text", text: GREETING },
          { id: id(), from: "bot", kind: "text", text: QUIZ_QUESTIONS[0].prompt },
        ]);
        setStep(0);
      }, TYPING_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [open, step, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function handleAnswer(value: string, label: string) {
    const question = QUIZ_QUESTIONS[step];
    const nextAnswers = { ...answers, [question.key]: value };
    setAnswers(nextAnswers);
    setMessages((m) => [...m, { id: id(), from: "user", text: label }]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const nextStep = step + 1;
      if (nextStep < QUIZ_QUESTIONS.length) {
        setMessages((m) => [...m, { id: id(), from: "bot", kind: "text", text: QUIZ_QUESTIONS[nextStep].prompt }]);
        setStep(nextStep);
      } else {
        const matches = matchProducts(products ?? [], nextAnswers, 3);
        setMessages((m) => [
          ...m,
          {
            id: id(),
            from: "bot",
            kind: "text",
            text:
              matches.length > 0
                ? "Based on what you've told me, here's what I'd suggest:"
                : "I couldn't find a match just yet — but here's what's closest to what you described:",
          },
          { id: id(), from: "bot", kind: "results", products: matches },
        ]);
        setStep(nextStep);
      }
    }, TYPING_DELAY_MS);
  }

  function startOver() {
    setMessages([]);
    setAnswers({});
    setStep(-1);
    setTyping(false);
  }

  const currentQuestion = step >= 0 && step < QUIZ_QUESTIONS.length ? QUIZ_QUESTIONS[step] : null;
  const showOptions = currentQuestion && !typing;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Find your scent"
      data-lenis-prevent
      className={`fixed bottom-24 right-6 z-50 flex h-[min(600px,80vh)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl transition-all duration-300 ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="label-caps flex items-center gap-2 text-gold">
          <Image src="/icons/amoria-mark.svg" alt="" aria-hidden width={13} height={13} />
          Find Your Scent
        </p>
        <button type="button" onClick={onClose} aria-label="Close" className="text-ink-soft transition-colors hover:text-ink">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Transcript — data-lenis-prevent stops the site's global Lenis
          smooth-scroll from hijacking wheel/touch input here and scrolling
          the page behind this panel instead of the transcript itself;
          overscroll-contain is the same fix for native scroll chaining once
          this list hits its own top/bottom. */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="themed-scroll flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} onNavigate={onClose} />
        ))}
        {typing && <TypingBubble />}
      </div>

      {/* Quick replies for the current question */}
      {showOptions && (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAnswer(opt.value, opt.label)}
              className="rounded-full border border-gold/40 px-4 py-2 text-xs text-ink transition-colors hover:border-gold hover:bg-gold/10"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {step === QUIZ_QUESTIONS.length && !typing && (
        <div className="border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={startOver}
            className="w-full rounded-full border border-border py-2.5 text-xs text-ink-soft transition-colors hover:border-gold/40 hover:text-ink"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

function ChatBubble({ message, onNavigate }: { message: Message; onNavigate: () => void }) {
  if (message.from === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gold-light px-4 py-2.5 text-sm text-ink">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.kind === "results") {
    return (
      <div className="flex flex-col gap-2">
        {message.products.map((product) => (
          <ResultCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-cream-dark px-4 py-2.5 text-sm leading-relaxed text-ink">
        {message.text}
      </div>
    </div>
  );
}

function ResultCard({ product, onNavigate }: { product: Product; onNavigate: () => void }) {
  const variant = product.variants[0];
  const price = variant?.price ?? product.price;
  const imageUrl = product.thumbnailImage ?? product.images[0]?.url;
  return (
    <Link
      href={`/product/${product.slug}`}
      // The chat panel stays mounted (see the component's own comment), so
      // without closing it here the product page opened underneath it and
      // it looked as if tapping a result did nothing.
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-xl bg-cream-dark p-2.5 transition-colors hover:bg-border"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
        {imageUrl && <Image src={imageUrl} alt={product.name} fill sizes="56px" className="object-contain" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-base text-ink">{product.name}</p>
        {product.scentAccords.length > 0 && (
          <p className="truncate text-xs text-gold">{product.scentAccords.slice(0, 2).join(" · ")}</p>
        )}
        <p className="mt-0.5 text-xs text-ink-soft">{formatAed(price)}</p>
      </div>
    </Link>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-cream-dark px-4 py-3">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
