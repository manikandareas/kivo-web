export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthTabsProps {
  defaultTab?: 'sign-in' | 'sign-up';
}

export interface OAuthProvider {
  id: 'google';
  name: string;
  icon: React.ReactNode;
}
