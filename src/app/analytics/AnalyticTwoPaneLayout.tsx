import type { ReactNode } from 'react';

export function AnalyticTwoPaneLayout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="flex w-full">
      <aside className="w-80 shrink-0 border-r border-[var(--sapList_BorderColor)] bg-[var(--sapList_Background)]">
        {left}
      </aside>
      <section className="flex-1 min-w-0">{right}</section>
    </div>
  );
}
