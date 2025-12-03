'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import {
  Button,
  Input,
  Label,
  Checkbox,
} from '@/features/shared/components/ui';
import type { SignInFormData } from '../types';

export interface SignInFormProps {
  callbackURL?: string;
}

export function SignInForm({ callbackURL = '/' }: SignInFormProps) {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      },
      {
        onSuccess: () => {
          toast.success('Successfully signed in');
          window.location.href = callbackURL;
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Failed to sign in');
        },
      }
    );

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          disabled={isLoading}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                rememberMe: checked === true,
              }))
            }
            disabled={isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal">
            Remember me
          </Label>
        </div>

        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}
