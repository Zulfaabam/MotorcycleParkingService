import React from 'react'
import { Outlet, useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { LogOut, Bike, User, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200'>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md'>
        <div className='max-w-[1126px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between'>
          <Link
            to='/'
            className='flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity'
          >
            <div className='p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary flex items-center justify-center'>
              <Bike className='w-5 h-5' />
            </div>
            <span className='font-heading font-semibold text-lg tracking-tight'>
              AbamsParking
            </span>
          </Link>

          {/* User Info & Actions */}
          {user && (
            <div className='flex items-center gap-4'>
              <div className='hidden sm:flex flex-col items-end text-right'>
                <span className='text-sm font-medium text-foreground flex items-center gap-1.5'>
                  <User className='w-3.5 h-3.5 text-muted-foreground' />
                  {user.firstName} {user.lastName}
                </span>
                <span className='text-xs text-muted-foreground flex items-center gap-1'>
                  <ShieldCheck className='w-3 h-3 text-primary' />
                  {user.roles.join(', ')}
                </span>
              </div>

              <div className='h-6 w-px bg-border hidden sm:block'></div>

              <button
                onClick={handleLogout}
                className='flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all cursor-pointer'
                title='Logout'
              >
                <LogOut className='w-4 h-4' />
                <span className='hidden sm:inline'>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className='flex-1 w-full max-w-[1126px] mx-auto px-4 md:px-8 py-8 flex flex-col'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className='w-full border-t border-border py-6 text-center text-xs text-muted-foreground bg-background'>
        <div className='max-w-[1126px] mx-auto px-4 md:px-8'>
          <p>
            © {new Date().getFullYear()} AbamsParking Parking System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
