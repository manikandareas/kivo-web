import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-60 disabled:saturate-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:translate-y-[3px] active:shadow-none active:border-b-0",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:brightness-110 border-b-[4px] border-b-[oklch(0.45_0.22_257)] shadow-md dark:border-b-[oklch(0.55_0.14_258)]',
        destructive:
          'bg-destructive text-white hover:brightness-110 border-b-[4px] border-b-[oklch(0.45_0.20_21)] shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:border-b-[oklch(0.52_0.18_20)]',
        outline:
          'bg-background text-foreground hover:bg-muted border border-border border-b-[4px] border-b-muted-foreground/30 shadow-sm',
        secondary:
          'bg-secondary text-secondary-foreground hover:brightness-110 border-b-[4px] border-b-[oklch(0.40_0.02_245)] shadow-md dark:border-b-[oklch(0.48_0.02_248)]',
        accent:
          'bg-accent text-accent-foreground hover:brightness-110 border-b-[4px] border-b-[oklch(0.55_0.18_51)] shadow-md dark:border-b-[oklch(0.62_0.15_63)]',
        ghost:
          'text-foreground hover:bg-muted hover:text-accent-foreground border-transparent shadow-none',
        link: 'text-primary underline-offset-4 hover:underline border-transparent shadow-none',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 rounded-xl px-8 has-[>svg]:px-4',
        icon: 'size-10 border-b-0 shadow-none',
        'icon-sm': 'size-9 border-b-0 shadow-none',
        'icon-lg': 'size-11 border-b-0 shadow-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
