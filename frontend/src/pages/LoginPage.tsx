import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/api'
import { Bike, Lock, Mail, ArrowRight, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await authApi.login(email, password)
      if (res.success && res.data) {
        login(res.data.token, res.data.user)
        toast.success(`Welcome back, ${res.data.user.firstName}!`)
        navigate('/', { replace: true })
      } else {
        toast.error(res.message || 'Login failed')
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        'Invalid email or password'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreFill = () => {
    setEmail('admin@parkir.com')
    setPassword('Admin123!')
    toast.info('Credentials loaded! Click Login.')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-foreground px-4 select-none'>
      <div className='w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-xl relative overflow-hidden transition-all duration-300'>
        {/* Decorative subtle ambient lights */}
        <div className='absolute -top-16 -left-16 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none'></div>
        <div className='absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none'></div>

        {/* Logo and Header */}
        <div className='flex flex-col items-center mb-8 relative z-10'>
          <div className='p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-4 flex items-center justify-center'>
            <Bike className='w-8 h-8' />
          </div>
          <h1 className='text-3xl font-heading font-bold text-foreground m-0 tracking-tight text-center'>
            Sign in to AbamsParking
          </h1>
          <p className='text-sm text-muted-foreground mt-1.5 text-center'>
            Manage your motorcycle parking records easily
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className='space-y-5 relative z-10'>
          <div>
            <label className='block text-xs font-semibold text-foreground uppercase tracking-wider mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='email@example.com'
                className='w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-transparent text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-foreground uppercase tracking-wider mb-2'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className='w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-transparent text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-medium text-sm transition-all cursor-pointer shadow-sm hover:scale-[1.01]'
          >
            {isSubmitting ? (
              <RefreshCw className='w-4 h-4 animate-spin' />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className='w-4 h-4' />
              </>
            )}
          </button>
        </form>

        {/* Helper Quick Seeding Button */}
        <div className='mt-6 pt-5 border-t border-border text-center relative z-10'>
          <button
            onClick={handlePreFill}
            type='button'
            className='text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground font-mono transition-all cursor-pointer'
          >
            🔑 Autofill Test Account
          </button>
        </div>
      </div>
    </div>
  )
}
