import { cn } from "@/lib/utils";

export function Avatar({
  src,
  alt,
  size = 40,
  className,
  ring,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn(
        "shrink-0 rounded-full border border-border bg-surface object-cover",
        ring && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background",
        className
      )}
    />
  );
}
