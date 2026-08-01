import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Field, SelectField, TextareaField } from '@/components/forms/Field';
import { ROUTES } from '@/constants/routes';

const phoneSchema = z
  .string()
  .min(10, 'Enter a valid phone number')
  .max(15, 'Enter a valid phone number')
  .regex(/^\+?[0-9]+$/, 'Use digits only, with an optional +');

const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Enter your password'),
});
type LoginValues = z.infer<typeof loginSchema>;

const ADMIN_PHONE = '01832498239';
const ADMIN_PASSWORD = 'admin';

function AuthBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex-1 overflow-hidden bg-gradient-to-br from-emerald-100/80 via-emerald-50/60 to-lime-100/80 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/80">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-600/15" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-lime-300/30 blur-3xl dark:bg-primary-700/20" />
        <div className="absolute left-[55%] top-16 h-44 w-44 rounded-full border border-emerald-300/30 dark:border-primary-700/20" />
        <div className="absolute left-[58%] top-24 h-28 w-28 rounded-full border border-emerald-300/30 dark:border-primary-700/20" />
        <div
          className="absolute inset-0 opacity-[0.065] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #16a34a 1px, transparent 1px), linear-gradient(to bottom, #16a34a 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />

        <svg
          viewBox="0 0 220 260"
          className="absolute -bottom-12 -left-8 w-48 rotate-[-8deg] text-primary-600/25 sm:w-64 dark:text-emerald-400/10"
          fill="none"
        >
          <path d="M108 258C106 184 111 116 137 42" stroke="currentColor" strokeWidth="8" />
          <path
            d="M130 72C76 72 47 45 48 3C100 2 132 27 130 72Z"
            fill="currentColor"
          />
          <path
            d="M116 127C62 126 30 100 28 57C82 55 115 80 116 127Z"
            fill="currentColor"
          />
          <path
            d="M124 105C176 102 207 76 211 35C160 31 127 56 124 105Z"
            fill="currentColor"
          />
        </svg>

        <svg
          viewBox="0 0 180 180"
          className="absolute -right-6 top-28 w-40 rotate-12 text-primary-600/25 sm:right-8 sm:w-52 dark:text-emerald-400/10"
          fill="none"
        >
          <path
            d="M42 60H138L128 153H52L42 60Z"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M65 64C65 33 79 20 90 20C101 20 115 33 115 64"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M90 88V128" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path
            d="M90 104C71 103 62 94 63 80C81 79 91 87 90 104Z"
            fill="currentColor"
          />
          <path
            d="M91 96C105 95 114 88 116 76C102 74 93 81 91 96Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <AuthBackdrop>
      <div className="mx-auto max-w-lg px-4 pb-8 pt-10 sm:pb-10 sm:pt-14">
        <div className="mb-7 text-center">
          <span className="mb-3 inline-flex items-center rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700 shadow-sm backdrop-blur dark:border-primary-800 dark:bg-gray-900/60 dark:text-emerald-300">
            Essentials made simple
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-primary-900/10 backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-800/90 sm:p-8">
          {children}
        </div>
      </div>
    </AuthBackdrop>
  );
}

export function LoginPage() {
  const [done, setDone] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const submit = async (values: LoginValues) => {
    await new Promise((resolve) => window.setTimeout(resolve, 500));

    if (isAdminLogin) {
      if (values.phone !== ADMIN_PHONE || values.password !== ADMIN_PASSWORD) {
        setError('root', { message: 'The admin phone number or password is incorrect.' });
        return;
      }

      window.sessionStorage.setItem('quickessentials-admin', 'true');
      await navigate(ROUTES.dashboardProducts, { replace: true });
      return;
    }

    setDone(true);
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin((current) => !current);
    setDone(false);
    reset();
  };
  return (
    <AuthShell
      title={isAdminLogin ? 'Admin Access' : 'Welcome Back'}
      subtitle={
        isAdminLogin
          ? 'Sign in to manage products and inventory'
          : 'Sign in to continue to QuickEssentials'
      }
    >
      {done && (
        <p className="mb-5 rounded-lg bg-green-100 p-3 text-green-800" role="status">
          Mock sign-in successful.
        </p>
      )}
      <form onSubmit={(event) => void handleSubmit(submit)(event)} className="space-y-5">
        {errors.root && (
          <p className="rounded-lg bg-red-100 p-3 text-sm text-red-800" role="alert">
            {errors.root.message}
          </p>
        )}
        <Field
          id="login-phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+8801XXXXXXXXX"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Field
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-between text-sm">
          <label>
            <input type="checkbox" className="mr-2 rounded" />
            Remember me
          </label>
          <Link to={ROUTES.forgotPassword} className="text-primary-600">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
          {isAdminLogin ? 'Enter Admin Dashboard' : 'Sign In'}
        </Button>
      </form>
      {isAdminLogin ? (
        <button
          type="button"
          onClick={toggleAdminLogin}
          className="mx-auto mt-6 block text-sm text-gray-500 transition hover:text-primary-600"
        >
          Return to customer sign in
        </button>
      ) : (
        <div className="mt-6 flex items-center justify-between gap-4 text-sm">
          <p>
            New here?{' '}
            <Link to={ROUTES.register} className="font-medium text-primary-600">
              Create an account
            </Link>
          </p>
          <button
            type="button"
            onClick={toggleAdminLogin}
            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-emerald-100 text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md hover:shadow-primary-900/10 dark:border-emerald-800 dark:from-emerald-950 dark:to-gray-900 dark:text-primary-300"
            aria-label="Open administrator sign in"
            title="Administrator access"
          >
            <span className="absolute inset-1 rounded-full border border-primary-500/15 transition group-hover:border-primary-500/30" aria-hidden="true" />
            <Icon name="key" className="relative text-sm transition-transform group-hover:-rotate-12" />
            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary-500 ring-2 ring-emerald-50 dark:ring-gray-900" aria-hidden="true" />
          </button>
        </div>
      )}
    </AuthShell>
  );
}

const registerSchema = z
  .object({
    role: z.enum(['customer', 'farmer']),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    phone: phoneSchema,
    address: z.string().min(8, 'Address is required'),
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string(),
    farmName: z.string().optional(),
    specialization: z.string().optional(),
    terms: z.literal(true, { errorMap: () => ({ message: 'Accept the terms to continue' }) }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'customer' },
  });
  const [done, setDone] = useState(false);
  const role = watch('role');
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setDone(true);
  };
  return (
    <AuthBackdrop>
      <div className="mx-auto max-w-4xl px-4 pb-8 pt-10 sm:pb-10 sm:pt-12">
        <div className="mb-7 text-center">
          <span className="mb-3 inline-flex items-center rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700 shadow-sm backdrop-blur dark:border-primary-800 dark:bg-gray-900/60 dark:text-emerald-300">
            Join QuickEssentials
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl">Create Your Account</h1>
          <p className="mx-auto mt-2 max-w-xl text-gray-600 dark:text-gray-400">
            A simpler, safer, and more convenient way to shop for your everyday essentials
          </p>
        </div>
        <form
          onSubmit={(event) => void handleSubmit(submit)(event)}
          className="space-y-7 rounded-2xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-primary-900/10 backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-800/90 sm:p-8"
        >
        {done && (
          <p className="rounded-lg bg-green-100 p-3 text-green-800">Your mock account is ready.</p>
        )}
        <fieldset>
          <legend className="mb-3 font-medium">I want to join as</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['customer', 'farmer'] as const).map((value) => (
              <label
                key={value}
                className="rounded-xl border p-4 capitalize has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900"
              >
                <input type="radio" value={value} className="mr-3" {...register('role')} />
                {value === 'farmer' ? 'Seller' : 'Customer'}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="firstName"
            label="First name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Field
            id="lastName"
            label="Last name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <div className="sm:col-span-2">
            <Field
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              label="Phone number"
              placeholder="+8801XXXXXXXXX"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <div className="sm:col-span-2">
            <TextareaField
              id="address"
              label="Address"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>
          <Field
            id="password"
            type="password"
            label="Password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Field
            id="confirmPassword"
            type="password"
            label="Confirm password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {role === 'farmer' && (
            <>
              <Field id="farmName" label="Business name" {...register('farmName')} />
              <SelectField
                id="specialization"
                label="Specialization"
                {...register('specialization')}
              >
                <option value="">Select one</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Dairy</option>
              </SelectField>
            </>
          )}
        </div>
        <label className="block text-sm">
          <input type="checkbox" className="mr-2 rounded" {...register('terms')} />I agree to the
          Terms and Privacy Policy
        </label>
        {errors.terms && <p className="text-sm text-red-600">{errors.terms.message}</p>}
        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
          Create Account
        </Button>
        <p className="text-center text-sm">
          Already registered?{' '}
          <Link to={ROUTES.login} className="text-primary-600">
            Sign in
          </Link>
        </p>
        </form>
      </div>
    </AuthBackdrop>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ phone: string }>({
    resolver: zodResolver(z.object({ phone: phoneSchema })),
  });
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setSent(true);
  };
  return (
    <AuthShell title="Reset Your Password" subtitle="We’ll send a secure reset code to your phone">
      {sent ? (
        <div className="rounded-xl bg-green-100 p-5 text-green-800" role="status">
          <h2 className="font-semibold">Reset code sent</h2>
          <p className="mt-1 text-sm">Check your phone and follow the reset instructions.</p>
        </div>
      ) : (
        <form onSubmit={(event) => void handleSubmit(submit)(event)} className="space-y-5">
          <Field
            id="reset-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            label="Phone number"
            placeholder="+8801XXXXXXXXX"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Send Reset Code
          </Button>
        </form>
      )}
      <Link to={ROUTES.login} className="mt-6 block text-center text-sm text-primary-600">
        Back to sign in
      </Link>
    </AuthShell>
  );
}
