import { cn } from '@/lib/utils';
import { ComponentProps, forwardRef } from 'react';
import RCurrencyInput from 'react-currency-input-field';

export const CurrencyInput = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof RCurrencyInput>
>(({ className, ...props }, ref) => {
  return (
    <RCurrencyInput
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});
