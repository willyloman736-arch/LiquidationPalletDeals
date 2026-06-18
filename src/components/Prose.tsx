import { cn } from "@/lib/cn";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose-custom space-y-4 text-base text-ink-700 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:my-1 [&_p]:leading-relaxed [&_a]:text-brand-700 [&_a:hover]:underline",
        className
      )}
    >
      {children}
    </div>
  );
}
