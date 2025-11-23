'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface ForgotPasswordForm {
  email: string;
  otp?: string;
  newPassword?: string;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmitEmail = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.sendOTP(data.email);
      setEmail(data.email);
      setStep('otp');
      setSuccess('OTP sent to your email. Please check your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.verifyOTP(email, data.otp!, data.newPassword!);
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP or password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Forgot Password
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter your email address and we&apos;ll send you an OTP to reset your password.
            </p>

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmitOTP)} className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter the OTP sent to {email} and your new password.
            </p>

            <Input
              label="OTP"
              type="text"
              placeholder="123456"
              error={errors.otp?.message}
              {...register('otp', {
                required: 'OTP is required',
              })}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Reset Password
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep('email')}
            >
              Back
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
