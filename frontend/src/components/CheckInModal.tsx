import React, { useState, useEffect } from 'react'
import { Bike, X } from 'lucide-react'

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { licensePlate: string; isNeedWashing: boolean; notes: string }) => void;
  isSubmitting: boolean;
  mode?: 'add' | 'edit';
  initialData?: { licensePlate: string; isNeedWashing: boolean; notes: string } | null;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  mode = 'add',
  initialData,
}) => {
  const [licensePlate, setLicensePlate] = useState('')
  const [isNeedWashing, setIsNeedWashing] = useState(false)
  const [notes, setNotes] = useState('')

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setLicensePlate(initialData.licensePlate)
        setIsNeedWashing(initialData.isNeedWashing)
        setNotes(initialData.notes)
      } else {
        setLicensePlate('')
        setIsNeedWashing(false)
        setNotes('')
      }
    }
  }, [isOpen, mode, initialData])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ licensePlate, isNeedWashing, notes })
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='relative w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer'
        >
          <X className='w-4 h-4' />
        </button>

        <h2 className='text-xl font-heading font-bold text-foreground m-0 mb-1 flex items-center gap-2'>
          <Bike className='w-5 h-5 text-primary' />
          {mode === 'add' ? 'Check In Motorcycle' : 'Edit Parking Record'}
        </h2>
        <p className='text-xs text-muted-foreground mb-6'>
          {mode === 'add'
            ? 'Create a new entry log in the parking system'
            : 'Update existing entry log details'}
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-foreground uppercase tracking-wider mb-2'>
              License Plate
            </label>
            <input
              type='text'
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder='e.g. B 1234 ABC'
              className='w-full px-3 py-2.5 rounded-lg border border-border bg-transparent text-foreground text-sm focus:outline-none focus:border-primary uppercase tracking-wide'
              required
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-foreground uppercase tracking-wider mb-2'>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Optional notes about the motorcycle...'
              className='w-full px-3 py-2.5 rounded-lg border border-border bg-transparent text-foreground text-sm focus:outline-none focus:border-primary resize-y min-h-20'
            />
          </div>

          <div className='flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/30'>
            <input
              type='checkbox'
              id='wash'
              checked={isNeedWashing}
              onChange={(e) => setIsNeedWashing(e.target.checked)}
              className='rounded border-border text-primary focus:ring-primary'
            />
            <label
              htmlFor='wash'
              className='text-sm text-foreground font-medium cursor-pointer select-none'
            >
              Request Motorcycle Wash (+Rp 10.000)
            </label>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-medium text-sm cursor-pointer'
            >
              {isSubmitting
                ? 'Submitting...'
                : mode === 'add'
                  ? 'Register Entry'
                  : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
