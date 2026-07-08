import React from 'react'
import { Search } from 'lucide-react'

interface ParkingFiltersProps {
  search: string
  onSearchChange: (val: string) => void
  filterStatus: 'all' | 'active' | 'completed'
  onFilterChange: (status: 'all' | 'active' | 'completed') => void
}

export const ParkingFilters: React.FC<ParkingFiltersProps> = ({
  search,
  onSearchChange,
  filterStatus,
  onFilterChange,
}) => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm'>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
        <input
          type='text'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search by license plate or brand...'
          className='w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-transparent text-sm focus:outline-none focus:border-primary transition-all'
        />
      </div>
      <div className='flex gap-1.5 self-center sm:self-auto'>
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
            filterStatus === 'all'
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'border-transparent text-muted-foreground hover:bg-muted'
          }`}
        >
          All Logs
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
            filterStatus === 'active'
              ? 'bg-green-500/10 border-green-500/30 text-green-600'
              : 'border-transparent text-muted-foreground hover:bg-muted'
          }`}
        >
          Parked
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
            filterStatus === 'completed'
              ? 'bg-gray-500/10 border-gray-500/30 text-gray-500'
              : 'border-transparent text-muted-foreground hover:bg-muted'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  )
}
