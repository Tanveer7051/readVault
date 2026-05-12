import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/apiService';
import Input from '../components/Input';
import Button from '../components/Button';
import { BookMarked, MailCheck } from 'lucide-react';

const registerSchema = z.object({
  firstname: z.string().min(2, 'Required'),
  lastname: z.string().min(2, 'Required'),
  username: z.string().min(3, 'Min 3 chars'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 chars'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await authService.register({
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-3 justify-center mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <BookMarked className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">ReadVault</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-sm text-slate-500">Join our exclusive digital library.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" {...register('firstname')} error={errors.firstname?.message} />
            <Input label="Last Name" placeholder="Doe" {...register('lastname')} error={errors.lastname?.message} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Username" placeholder="johndoe123" {...register('username')} error={errors.username?.message} />
            <Input label="Email" type="email" placeholder="john@example.com" {...register('email')} error={errors.email?.message} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
            <Input label="Confirm Password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
          </div>
          
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" {...register('terms')} />
              <span className="text-xs text-slate-600">
                I agree to the <Link to="#" className="text-primary font-bold hover:underline">Terms & Conditions</Link> and <Link to="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </span>
            </label>
            {errors.terms && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.terms.message}</p>}
          </div>

          <Button type="submit" className="w-full text-base py-2.5 mt-2" isLoading={isSubmitting}>
            Register
          </Button>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
