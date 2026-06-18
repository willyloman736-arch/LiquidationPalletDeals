import Link from "next/link";
import Image from "next/image";

export function Logo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Wholesale101.com — home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src="/images/brand/logo.webp"
        alt="Wholesale101.com"
        width={480}
        height={84}
        priority={priority}
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  );
}
