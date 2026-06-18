import { Prose } from "./Prose";

export type LegalSection = {
  heading: string | null;
  paragraphs: string[];
  list?: string[];
};

export function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <Prose>
      {sections.map((s, i) => (
        <section key={i} className="mb-8 last:mb-0">
          {s.heading && <h2>{s.heading}</h2>}
          {s.paragraphs.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
          {s.list && s.list.length > 0 && (
            <ul>
              {s.list.map((li, k) => (
                <li key={k}>{li}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </Prose>
  );
}
