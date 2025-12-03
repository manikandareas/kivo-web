'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/features/shared/components/ui';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { OAuthButtons } from './oauth-buttons';
import type { AuthTabsProps } from '../types';
import { z } from 'better-auth';

export function AuthTabs({ defaultTab = 'sign-in' }: AuthTabsProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="mt-4">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up" className="mt-4">
            <SignUpForm />
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <OAuthButtons callbackURL="http://localhost:3000" />
      </CardContent>
    </Card>
  );
}
