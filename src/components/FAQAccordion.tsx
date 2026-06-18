"use client";

import { useState } from "react";
import type { FAQ } from "@/data/faq";
import { Icon } from "./Icon";

export function FAQAccordion({ items, idPrefix = "faq" }: { items: FAQ[]; idPrefix?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-ink-100 rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
      {items.map((item, i) => {
        const expanded = open === i;
        const panelId = `${idPrefix}-panel-${i}`;
        const btnId = `${idPrefix}-btn-${i}`;
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600"
              >
                <span className="text-sm font-semibold text-ink-900 sm:text-base">{item.question}</span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-700 transition ${
                    expanded ? "rotate-180 bg-brand-50 text-brand-700" : ""
                  }`}
                >
                  <Icon name="chevronDown" className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!expanded}
              className="px-5 pb-5 text-sm leading-relaxed text-ink-600 whitespace-pre-line animate-fade-in"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
