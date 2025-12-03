'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Button, Input, Label } from '@/features/shared/components/ui';
import { generateProfileImage } from '../utils/profile';
import type { SignUpFormData } from '../types';

export interface SignUpFormProps {
  callbackURL?: string;
}

export function SignUpForm({ callbackURL = '/' }: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePasswordConfirmation = (): boolean => {
    if (formData.password !== formData.passwordConfirmation) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirmation
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validatePasswordConfirmation()) {
      return;
    }

    setIsLoading(true);

    const name = `${formData.firstName} ${formData.lastName}`;

    await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name,
        image: generateProfileImage(name),
        callbackURL,
      },
      {
        onSuccess: () => {
          toast.success('Account created successfully');
          window.location.href = callbackURL;
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Failed to create account');
        },
      }
    );

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signUpEmail">Email</Label>
        <Input
          id="signUpEmail"
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
        <Label htmlFor="signUpPassword">Password</Label>
        <Input
          id="signUpPassword"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passwordConfirmation">Confirm Password</Label>
        <Input
          id="passwordConfirmation"
          type="password"
          placeholder="Confirm your password"
          value={formData.passwordConfirmation}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              passwordConfirmation: e.target.value,
            }));
            if (passwordError) {
              setPasswordError(null);
            }
          }}
          disabled={isLoading}
          required
        />
        {passwordError && (
          <p className="text-sm text-destructive">{passwordError}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Sign Up'
        )}
      </Button>
    </form>
  );
}
