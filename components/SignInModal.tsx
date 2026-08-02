"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), type === 'success' ? 5000 : 8000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!signInData.email.trim()) {
      showMessage('Email is required', 'error');
      setIsLoading(false);
      return;
    }

    if (!signInData.password.trim()) {
      showMessage('Password is required', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email.trim(),
        password: signInData.password,
      });

      if (error) throw error;

      showMessage('Signed in successfully!', 'success');
      
      // Close modal and reload to refresh job matches
      setTimeout(() => {
        onOpenChange(false);
        router.refresh();
      }, 1000);

    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message.includes('Email not confirmed')) {
        showMessage('Please check your email and confirm your account before signing in.', 'error');
      } else if (error.message.includes('Invalid login credentials')) {
        showMessage('Invalid email or password. Please try again.', 'error');
      } else {
        showMessage(error.message || 'Failed to sign in', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      showMessage(error.message || 'Failed to sign in with Google', 'error');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setMessage('');

    if (!resetEmail.trim()) {
      showMessage('Please enter your email address', 'error');
      setIsResetting(false);
      return;
    }

    if (!resetEmail.includes('@')) {
      showMessage('Please enter a valid email address', 'error');
      setIsResetting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      showMessage('Password reset email sent! Please check your inbox.', 'success');
      setResetEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
      }, 2000);

    } catch (error: any) {
      console.error('Password reset error:', error);
      showMessage(error.message || 'Failed to send reset email', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    setSignInData({ email: '', password: '' });
    setResetEmail('');
    setShowForgotPassword(false);
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JobMeter
            </DialogTitle>
          </div>
          <DialogTitle className="text-xl text-center">
            {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {showForgotPassword 
              ? 'Enter your email address and we\'ll send you a link to reset your password'
              : 'Sign in to your account to continue'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-lg flex items-center gap-3 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-red-600 border-t-transparent animate-spin flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {!showForgotPassword ? (
          // Sign In Form
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="signin-email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="signin-password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-12"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="reset-email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={isResetting}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                disabled={isResetting}
              >
                Back to sign in
              </button>
            </div>
            
            <Button 
              type="submit"
              disabled={isResetting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
