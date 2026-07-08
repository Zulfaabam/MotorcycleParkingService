import React from 'react'
import { ClipboardList, RefreshCw, Plus } from 'lucide-react'

interface ParkingHeaderProps {
  onRefetch: () => void
  isLoading: boolean
  isRefetching: boolean
  onAddClick: () => void
}

export const ParkingHeader: React.FC<ParkingHeaderProps> = ({
  onRefetch,
  isLoading,
  isRefetching,
  onAddClick,
}) => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
      <div>
        <h1 className='text-3xl font-heading font-bold text-foreground m-0 tracking-tight flex items-center gap-3'>
          <ClipboardList className='w-8 h-8 text-primary' />
          Parking Records
        </h1>
        <p className='text-sm text-muted-foreground mt-1'>
          A list of parked motorcycles in AbamsParking
        </p>
      </div>
      <div className='flex gap-2'>
        <button
          onClick={onRefetch}
          className='p-2.5 rounded-lg border border-border hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer'
          title='Refresh logs'
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading || isRefetching ? 'animate-spin' : ''}`}
          />
        </button>
        <button
          onClick={onAddClick}
          className='flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-medium text-sm transition-all cursor-pointer shadow-sm'
        >
          <Plus className='w-4 h-4' />
          <span>Check In</span>
        </button>
      </div>
    </div>
  )
}
