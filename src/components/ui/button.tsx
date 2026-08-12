import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-sm text-button transition-all duration-200 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-xl bg-primary px-xl py-md text-on-primary hover:bg-primary-active active:bg-primary-active shadow-xs hover:shadow-sm",
        secondary:
          "rounded-xl border border-border bg-canvas px-xl py-md text-ink hover:bg-primary-pale hover:border-primary active:bg-primary-pale",
        tertiary:
          "rounded-xl border border-border bg-canvas px-xl py-md text-ink hover:bg-primary-pale hover:border-primary active:bg-primary-pale",
        icon: "size-11 rounded-pill border border-border bg-canvas p-0 text-ink hover:bg-primary-pale hover:border-primary active:bg-primary-pale",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
