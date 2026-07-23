import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Spinner } from '@/components/feedback/Spinner';
import { cn } from '@/utils/cn';

/**
 * Button variants map 1:1 to the recurring button styles across the templates:
 * - primary  -> `bg-primary-600 hover:bg-primary-700 text-white`
 * - secondary-> gray fill used by "Add to Cart" on the details page
 * - outline  -> bordered neutral (icon buttons, "View")
 * - destructive -> red bordered "Delete" / "Cancel Order"
 * - ghost    -> text-only nav actions
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary:
          'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
        outline:
          'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
        destructive:
          'border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40',
        ghost: 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3',
        icon: 'h-10 w-10',
      },
      fullWidth: { true: 'w-full', false: '' },
      /** Matches the template's `transform hover:scale-105` on primary CTAs. */
      emphasize: { true: 'transform transition hover:scale-105', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false, emphasize: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the single child element (e.g. an anchor / router Link). */
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, emphasize, asChild, isLoading, children, disabled, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth, emphasize }), className)}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Icon name="seedling" spin aria-hidden />
          <span>Please wait…</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
});

export { buttonVariants };
