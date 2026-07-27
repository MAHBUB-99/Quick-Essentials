import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/utils/cn';

const control =
  'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white';

interface BaseProps {
  label: string;
  error?: string;
}

export const Field = forwardRef<
  HTMLInputElement,
  BaseProps & InputHTMLAttributes<HTMLInputElement>
>(function Field({ label, error, id, className, ...props }, ref) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
      <input
        id={id}
        ref={ref}
        className={cn(control, className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
});

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextareaField({ label, error, id, ...props }, ref) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
      <textarea id={id} ref={ref} className={control} aria-invalid={!!error} {...props} />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  BaseProps & SelectHTMLAttributes<HTMLSelectElement>
>(function SelectField({ label, error, id, children, ...props }, ref) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
      <select id={id} ref={ref} className={control} aria-invalid={!!error} {...props}>
        {children}
      </select>
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
});
