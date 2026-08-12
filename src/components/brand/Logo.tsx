import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({ size = 34, className, priority }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Vaultly"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
