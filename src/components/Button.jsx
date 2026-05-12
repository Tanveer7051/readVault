import { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 text-sm shadow-sm',
        variant === 'primary' ? 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-rose-200' : '',
        variant === 'secondary' ? 'bg-rose-50 hover:bg-rose-100 text-primary border border-rose-100' : '',
        variant === 'outline' ? 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-800 shadow-none' : '',
        variant === 'ghost' ? 'hover:bg-slate-50 text-slate-800 shadow-none' : '',
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
