"use client";

import { useState } from "react";

import { cardClass } from "@/components/ui/card";

export type FAQItem = {
  question: string;
  answer: string;
};

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question} className={cardClass({ padding: "none" })}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-body font-semibold text-text-primary">{item.question}</span>
              <span
                className={`shrink-0 text-lg text-brand-cyan-strong transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen ? (
              <div className="text-body px-6 pb-5 text-text-secondary">{item.answer}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
