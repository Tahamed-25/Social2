import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-lg font-bold font-headline text-foreground",
        className
      )}
    >
      <svg
        className="h-7 w-auto"
        viewBox="0 0 108 87"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40.3857 86.6665L0.996582 0.333008H21.0299L50.404 69.1105L79.7781 0.333008H99.8114L60.4223 86.6665H40.3857Z"
          fill="hsl(var(--foreground))"
        />
        <path
          d="M69.522 56.4118L106.875 0H86.7961L59.8162 38.8235L69.522 56.4118Z"
          fill="hsl(var(--primary))"
        />
      </svg>
      Social-fit
    </Link>
  );
}
