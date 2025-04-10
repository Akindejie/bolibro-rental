'use client';

import React, { useEffect, createContext, useContext } from 'react';
import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter, usePathname } from 'next/navigation';
import {
  fetchAuthSession,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
} from 'aws-amplify/auth';

// https://docs.amplify.aws/gen1/javascript/tools/libraries/configure-categories/
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

// Create the auth context
const AuthContext = createContext<{
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Create the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const components = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading level={3} className="!text-2xl !font-bold">
          BOLIBRO
          <span className="text-secondary-500 font-light hover:!text-primary-300">
            REALTY
          </span>
        </Heading>
        <p className="text-muted-foreground mt-2">
          <span className="font-bold">Welcome!</span> Please sign in to continue
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              onClick={toSignUp}
              className="text-primary hover:underline bg-transparent border-none p-0"
            >
              Sign up here
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors?.['custom:role']}
            hasError={!!validationErrors?.['custom:role']}
            isRequired
          >
            <Radio value="tenant">Tenant</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      );
    },

    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={toSignIn}
              className="text-primary hover:underline bg-transparent border-none p-0"
            >
              Sign in
            </button>
          </p>
        </View>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Email',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your password',
      label: 'Password',
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: 'Choose a username',
      label: 'Username',
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: 'Enter your email address',
      label: 'Email',
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: 'Create a password',
      label: 'Password',
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: 'Confirm your password',
      label: 'Confirm Password',
      isRequired: true,
    },
  },
};

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage =
    pathname.startsWith('/manager') || pathname.startsWith('/tenants');

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    try {
      await amplifySignIn({
        username: email,
        password,
      });
      // If successful, the Auth component will automatically update the user
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: string) => {
    try {
      const { userId, isSignUpComplete } = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:role': role,
          },
          autoSignIn: true, // Automatically sign in after verification
        },
      });

      console.log('Sign up successful', { userId, isSignUpComplete });

      if (isSignUpComplete) {
        router.push('/signin?verifyEmail=true');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Auth context value
  const authValue = {
    user,
    signIn,
    signUp,
    signOut,
  };

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (user && isAuthPage) {
      // Check user role directly from token and redirect accordingly
      const checkRole = async () => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const userRole = idToken?.payload['custom:role'] as string;

          console.log('Auth provider - User role from token:', userRole);

          if (userRole?.toLowerCase() === 'manager') {
            // Directly redirect managers to properties page
            router.push('/managers/properties');
          } else {
            // Redirect tenants to home page
            router.push('/');
          }
        } catch (err) {
          console.error('Error checking user role:', err);
          // Fallback to homepage
          router.push('/');
        }
      };

      checkRole();
    }
  }, [user, isAuthPage, router]);

  // Allow access to public pages without authentication
  if (!isAuthPage && !isDashboardPage) {
    return (
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <div className="h-full">
        <Authenticator
          initialState={pathname.includes('signup') ? 'signUp' : 'signIn'}
          components={components}
          formFields={formFields}
        >
          {() => <>{children}</>}
        </Authenticator>
      </div>
    </AuthContext.Provider>
  );
};

export default Auth;
