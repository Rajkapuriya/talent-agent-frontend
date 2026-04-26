import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login, register } from '../api/auth.api';
import { useAuthStore } from '../store/useAuthStore';
import Spinner from '../components/ui/Spinner';

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2, 'Enter your full name'),
});

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState('');

  const schema = mode === 'login' ? LoginSchema : RegisterSchema;

  const {
    register: reg,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiErr('');
    try {
      const fn = mode === 'login' ? login : register;
      const res = await fn(data);
      const { token, user } = res.data;
      setAuth(token, user);
      navigate('/', { replace: true });
    } catch (err) {
      setApiErr(
        err.response?.data?.error ?? 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-blue-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-16 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="mx-auto flex min-h-[85vh] w-full max-w-sm items-center">
        <div className="glass-card w-full p-6 sm:p-7">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div
            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-lg font-display font-semibold text-white shadow-lg"
          >
            TA
          </div>
          <h1 className="font-display text-xl font-semibold text-slate-900">
            Talent Agent
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {mode === 'login'
              ? 'Sign in to your account'
              : 'Create a recruiter account'}
          </p>
        </div>

        {/* Card */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Full name
                </label>
                <input
                  {...reg('name')}
                  placeholder="Priya Mehta"
                  className="input-modern"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                {...reg('email')}
                type="email"
                placeholder="recruiter@company.com"
                className="input-modern"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                {...reg('password')}
                type="password"
                placeholder="Min 8 characters"
                className="input-modern"
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {apiErr && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {apiErr}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading && <Spinner size={14} />}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="border-t border-slate-200 pt-2 text-center">
            <button
              onClick={() => {
                setMode((m) => (m === 'login' ? 'register' : 'login'));
                setApiErr('');
              }}
              className="text-xs text-slate-500 transition-colors hover:text-slate-800"
            >
              {mode === 'login'
                ? "Don't have an account? Register"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
