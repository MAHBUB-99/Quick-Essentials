import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Field, SelectField, TextareaField } from '@/components/forms/Field';
import { ROUTES } from '@/constants/routes';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
});
type LoginValues = z.infer<typeof loginSchema>;

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
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">{children}</div>
    </div>
  );
}

export function LoginPage() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setDone(true);
  };
  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue to FarmFresh">
      {done && (
        <p className="mb-5 rounded-lg bg-green-100 p-3 text-green-800" role="status">
          Mock sign-in successful.
        </p>
      )}
      <form onSubmit={(event) => void handleSubmit(submit)(event)} className="space-y-5">
        <Field
          id="login-email"
          label="Email address"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
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
          Sign In
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        New to FarmFresh?{' '}
        <Link to={ROUTES.register} className="font-medium text-primary-600">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

const registerSchema = z
  .object({
    role: z.enum(['customer', 'farmer']),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(10, 'Enter a valid phone number'),
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
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Join FarmFresh as a customer or local producer
        </p>
      </div>
      <form
        onSubmit={(event) => void handleSubmit(submit)(event)}
        className="space-y-7 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
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
                {value}
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
          <Field
            id="register-email"
            type="email"
            label="Email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Field id="phone" label="Phone" error={errors.phone?.message} {...register('phone')} />
          <TextareaField
            id="address"
            label="Address"
            error={errors.address?.message}
            {...register('address')}
          />
          <div />
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
              <Field id="farmName" label="Farm name" {...register('farmName')} />
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
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().email('Enter a valid email') })),
  });
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setSent(true);
  };
  return (
    <AuthShell title="Reset Your Password" subtitle="We’ll send a secure reset link to your email">
      {sent ? (
        <div className="rounded-xl bg-green-100 p-5 text-green-800" role="status">
          <h2 className="font-semibold">Email sent successfully</h2>
          <p className="mt-1 text-sm">Check your inbox and follow the reset link.</p>
        </div>
      ) : (
        <form onSubmit={(event) => void handleSubmit(submit)(event)} className="space-y-5">
          <Field
            id="reset-email"
            type="email"
            label="Email address"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Send Reset Link
          </Button>
        </form>
      )}
      <Link to={ROUTES.login} className="mt-6 block text-center text-sm text-primary-600">
        Back to sign in
      </Link>
    </AuthShell>
  );
}
