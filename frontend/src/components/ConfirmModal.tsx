import React from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isProcessing?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isProcessing = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-destructive/10 text-destructive',
          btnBg: 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20',
        }
      case 'warning':
        return {
          iconBg: 'bg-orange-500/10 text-orange-500',
          btnBg: 'bg-orange-500/10 border-orange-500/30 text-orange-600 hover:bg-orange-500/20',
        }
      case 'info':
      default:
        return {
          iconBg: 'bg-primary/10 text-primary',
          btnBg: 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='relative w-full max-w-sm p-6 rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200'>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className='absolute right-4 top-4 p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer'
        >
          <X className='w-4 h-4' />
        </button>

        <div className='flex items-center gap-3 mb-4'>
          <div className={`p-2 rounded-full ${styles.iconBg}`}>
            <AlertTriangle className='w-6 h-6' />
          </div>
          <h2 className='text-lg font-heading font-bold text-foreground m-0'>
            {title}
          </h2>
        </div>

        <p className='text-sm text-muted-foreground mb-6'>{message}</p>

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={onCancel}
            disabled={isProcessing}
            className='px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm cursor-pointer disabled:opacity-50'
          >
            {cancelText}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg border font-medium text-sm cursor-pointer disabled:opacity-50 transition-colors ${styles.btnBg}`}
          >
            {isProcessing ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
