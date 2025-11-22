'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Eye, EyeOff, CircleCheckBig, Circle } from 'lucide-react';

import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/common/components/ui/popover';

// Password validation schema
const formSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Password strength calculator
const getPasswordStrength = password => {
  if (!password) return { level: 0, text: '', color: '', percentage: 0 };
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: 1, text: 'Weak', color: 'bg-red-500', textColor: 'text-red-400', percentage: 25 };
  if (strength <= 3) return { level: 2, text: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400', percentage: 50 };
  if (strength <= 4) return { level: 3, text: 'Good', color: 'bg-blue-500', textColor: 'text-blue-400', percentage: 75 };
  return { level: 4, text: 'Strong', color: 'bg-green-500', textColor: 'text-green-400', percentage: 100 };
};

export default function Settings() {
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = form.watch('newPassword');
  const passwordStrength = getPasswordStrength(newPassword);

  async function onSubmit(data) {
    try {
      console.log('Password change data:', data);

      toast.success('Password Changed Successfully', {
        description:
          'Your password has been updated. Please use your new password on your next login.',
        position: 'bottom-right',
      });

      form.reset();
    } catch (error) {
      toast.error('Password Change Failed', {
        description:
          error.message || 'An error occurred while changing your password. Please try again.',
        position: 'bottom-right',
      });
    }
  }

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
            <h2 className="text-zinc-400 text-sm mb-6">
              Update your password to keep your account secure
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Current Password */}
              <div>
                <label htmlFor="current-password" className="block text-zinc-500 text-sm mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Controller
                    name="currentPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          id="current-password"
                          type={showPasswords.current ? 'text' : 'password'}
                          placeholder="Enter your current password"
                          autoComplete="current-password"
                          className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-12 h-12 rounded-lg transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1.5">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* New Password with Popover */}
              <div>
                <label htmlFor="new-password" className="block text-zinc-500 text-sm mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Popover open={popoverOpen && !!newPassword} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <div className="relative">
                              <Input
                                {...field}
                                id="new-password"
                                type={showPasswords.new ? 'text' : 'password'}
                                placeholder="Enter new password (min 8 characters)"
                                autoComplete="new-password"
                                onFocus={() => setPopoverOpen(true)}
                                onBlur={() => setPopoverOpen(false)}
                                className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-12 h-12 rounded-lg transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors z-10"
                              >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            side="top"
                            align="start"
                            className="w-80 p-0 bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700"
                            onOpenAutoFocus={(e) => e.preventDefault()}
                          >
                            <div className="p-5">
                              {/* Header */}
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-medium text-zinc-400">Password Strength</span>
                                <span className={`text-sm font-bold ${passwordStrength.textColor} flex items-center gap-1.5`}>
                                  <span className={`w-2 h-2 rounded-full ${passwordStrength.color}`} />
                                  {passwordStrength.text}
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div className="relative h-2.5 bg-zinc-950/50 rounded-full overflow-hidden mb-4 shadow-inner">
                                <div
                                  className={`h-full ${passwordStrength.color} transition-all duration-500 ease-out`}
                                  style={{ width: `${passwordStrength.percentage}%` }}
                                />
                              </div>

                              {/* Criteria Checklist */}
                              <div className="space-y-2.5">
                                <div className="flex items-center gap-2.5">
                                  {newPassword.length >= 8 ? (
                                    <CircleCheckBig size={16} className="text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Circle size={16} className="text-zinc-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-xs ${newPassword.length >= 8 ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>
                                    At least 8 characters
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  {/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? (
                                    <CircleCheckBig size={16} className="text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Circle size={16} className="text-zinc-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-xs ${/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>
                                    Uppercase & lowercase letters
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  {/\d/.test(newPassword) ? (
                                    <CircleCheckBig size={16} className="text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Circle size={16} className="text-zinc-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-xs ${/\d/.test(newPassword) ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>
                                    At least one number
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  {/[^a-zA-Z0-9]/.test(newPassword) ? (
                                    <CircleCheckBig size={16} className="text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Circle size={16} className="text-zinc-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-xs ${/[^a-zA-Z0-9]/.test(newPassword) ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>
                                    Special character (!@#$%^&*)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1.5">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-zinc-500 text-sm mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          id="confirm-password"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          placeholder="Re-enter your new password"
                          autoComplete="new-password"
                          className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-12 h-12 rounded-lg transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {fieldState.error && (
                          <p className="text-red-400 text-xs mt-1.5">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 hover:border-zinc-600 px-6 h-11 rounded-lg flex-1 transition-all"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 h-11 rounded-lg flex-1 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
