import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  parkingApi,
  type ParkingRecordDto,
  type CreateParkingRecordDto,
  type UpdateParkingRecordDto,
} from '../api/api'
import {
  Bike,
  Search,
  RefreshCw,
  Plus,
  Droplets,
  CheckCircle,
  Trash2,
  DollarSign,
  Calendar,
  Clock,
  EyeOff,
  ClipboardList,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

export const ParkingListPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'completed'
  >('all')
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [licensePlate, setLicensePlate] = useState('')
  const [isNeedWashing, setIsNeedWashing] = useState(false)

  // Fetch parking records
  const {
    data: response,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['parkingRecords'],
    queryFn: parkingApi.getAll,
  })

  const records = response?.data || []

  // Mutations
  const checkInMutation = useMutation({
    mutationFn: (data: CreateParkingRecordDto) => parkingApi.create(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Motorcycle checked in successfully')
        setIsCheckInOpen(false)
        setLicensePlate('')
        setIsNeedWashing(false)
        queryClient.invalidateQueries({ queryKey: ['parkingRecords'] })
      } else {
        toast.error(res.errors[0] || 'Check-in failed')
      }
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.errors?.[0] || 'Failed to check in'
      toast.error(errorMsg)
    },
  })

  const checkOutMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParkingRecordDto }) =>
      parkingApi.update(id, data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(
          `Check-out complete! Fee: Rp ${res.data.estimatedFee.toLocaleString()}`,
        )
        queryClient.invalidateQueries({ queryKey: ['parkingRecords'] })
      } else {
        toast.error(res.errors[0] || 'Check-out failed')
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.errors?.[0] || 'Failed to check out')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => parkingApi.delete(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Record deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['parkingRecords'] })
      } else {
        toast.error(res.errors[0] || 'Failed to delete record')
      }
    },
    onError: () => {
      toast.error('Failed to delete record')
    },
  })

  // Calculate Metrics
  const activeRecords = records.filter((r) => !r.exitTime)
  const totalActive = activeRecords.length
  const washRequests = activeRecords.filter((r) => r.isNeedWashing).length
  const totalRevenue = records.reduce((acc, curr) => acc + curr.estimatedFee, 0)

  // Filtered list
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.motorcycleLicensePlate.toLowerCase().includes(search.toLowerCase()) ||
      (r.motorcycleBrandName &&
        r.motorcycleBrandName.toLowerCase().includes(search.toLowerCase()))

    if (filterStatus === 'active') {
      return matchesSearch && !r.exitTime
    }
    if (filterStatus === 'completed') {
      return matchesSearch && r.exitTime
    }
    return matchesSearch
  })

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!licensePlate.trim()) {
      toast.error('License plate is required')
      return
    }

    const entryTime = new Date().toISOString()
    checkInMutation.mutate({
      motorcycleLicensePlate: licensePlate.toUpperCase(),
      entryTime,
      isNeedWashing,
    })
  }

  const handleCheckOut = (record: ParkingRecordDto) => {
    const exitTime = new Date().toISOString()
    const data: UpdateParkingRecordDto = {
      motorcycleLicensePlate: record.motorcycleLicensePlate,
      entryTime: record.entryTime,
      exitTime,
      estimatedFee: record.isNeedWashing ? 15000 : 5000,
      isNeedWashing: record.isNeedWashing,
    }
    checkOutMutation.mutate({ id: record.id, data })
  }

  const handleDelete = (id: string) => {
    if (
      window.confirm('Are you sure you want to delete this parking record?')
    ) {
      deleteMutation.mutate(id)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='flex flex-col gap-8 w-full'>
      {/* Header section with Action Button */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-heading font-bold text-foreground m-0 tracking-tight flex items-center gap-3'>
            <ClipboardList className='w-8 h-8 text-primary' />
            Parking Logs
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Real-time overview of parked motorcycles and washing queue
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => refetch()}
            className='p-2.5 rounded-lg border border-border hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer'
            title='Refresh logs'
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading || isRefetching ? 'animate-spin' : ''}`}
            />
          </button>
          <button
            onClick={() => setIsCheckInOpen(true)}
            className='flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-medium text-sm transition-all cursor-pointer shadow-sm'
          >
            <Plus className='w-4 h-4' />
            <span>Check In</span>
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='p-6 rounded-xl border border-border bg-card shadow-sm relative overflow-hidden flex items-center gap-4'>
          <div className='p-3 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20'>
            <Bike className='w-6 h-6' />
          </div>
          <div>
            <p className='text-xs uppercase tracking-wider font-semibold text-muted-foreground'>
              Parked Motorcycles
            </p>
            <h3 className='text-2xl font-bold font-heading text-card-foreground mt-1'>
              {totalActive}
            </h3>
          </div>
        </div>

        <div className='p-6 rounded-xl border border-border bg-card shadow-sm relative overflow-hidden flex items-center gap-4'>
          <div className='p-3 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20'>
            <Droplets className='w-6 h-6' />
          </div>
          <div>
            <p className='text-xs uppercase tracking-wider font-semibold text-muted-foreground'>
              Wash Requests
            </p>
            <h3 className='text-2xl font-bold font-heading text-card-foreground mt-1'>
              {washRequests}
            </h3>
          </div>
        </div>

        <div className='p-6 rounded-xl border border-border bg-card shadow-sm relative overflow-hidden flex items-center gap-4'>
          <div className='p-3 rounded-lg bg-primary/10 text-primary border border-primary/30'>
            <DollarSign className='w-6 h-6' />
          </div>
          <div>
            <p className='text-xs uppercase tracking-wider font-semibold text-muted-foreground'>
              Total Revenue
            </p>
            <h3 className='text-2xl font-bold font-heading text-card-foreground mt-1'>
              Rp {totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by license plate or brand...'
            className='w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-transparent text-sm focus:outline-none focus:border-primary transition-all'
          />
        </div>
        <div className='flex gap-1.5 self-center sm:self-auto'>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
              filterStatus === 'all'
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-transparent text-muted-foreground hover:bg-muted'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
              filterStatus === 'active'
                ? 'bg-green-500/10 border-green-500/30 text-green-600'
                : 'border-transparent text-muted-foreground hover:bg-muted'
            }`}
          >
            Parked
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
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

      {/* Main Table */}
      <div className='overflow-x-auto rounded-xl border border-border bg-card shadow-sm'>
        <table className='w-full border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b border-border bg-muted/50 text-card-foreground font-medium'>
              <th className='p-4'>License Plate</th>
              <th className='p-4'>Brand</th>
              <th className='p-4'>Entry Details</th>
              <th className='p-4'>Exit Details</th>
              <th className='p-4'>Services</th>
              <th className='p-4 text-right'>Fee</th>
              <th className='p-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {isLoading ? (
              <tr>
                <td colSpan={7} className='p-8 text-center text-muted-foreground'>
                  <div className='flex items-center justify-center gap-2'>
                    <RefreshCw className='w-5 h-5 animate-spin text-primary' />
                    <span>Loading logs...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className='p-12 text-center text-muted-foreground'>
                  <div className='flex flex-col items-center gap-2'>
                    <EyeOff className='w-8 h-8 text-muted-foreground/50' />
                    <span className='font-medium text-foreground'>
                      No records found
                    </span>
                    <span className='text-xs'>
                      Try modifying your search or check-in a new motorcycle.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className='hover:bg-muted/30 transition-colors'
                >
                  <td className='p-4 font-mono font-bold text-foreground tracking-wide'>
                    <span className='inline-block px-2.5 py-1 rounded bg-muted border border-border'>
                      {record.motorcycleLicensePlate}
                    </span>
                  </td>
                  <td className='p-4 font-medium text-foreground'>
                    {record.motorcycleBrandName || (
                      <span className='text-muted-foreground/60 text-xs italic'>
                        Not verified
                      </span>
                    )}
                  </td>
                  <td className='p-4'>
                    <div className='flex flex-col'>
                      <span className='text-foreground font-medium flex items-center gap-1'>
                        <Clock className='w-3.5 h-3.5' />
                        {formatTime(record.entryTime)}
                      </span>
                      <span className='text-muted-foreground text-xs flex items-center gap-1 mt-0.5'>
                        <Calendar className='w-3.5 h-3.5' />
                        {formatDate(record.entryTime)}
                      </span>
                    </div>
                  </td>
                  <td className='p-4'>
                    {record.exitTime ? (
                      <div className='flex flex-col'>
                        <span className='text-foreground font-medium flex items-center gap-1'>
                          <Clock className='w-3.5 h-3.5' />
                          {formatTime(record.exitTime)}
                        </span>
                        <span className='text-muted-foreground text-xs flex items-center gap-1 mt-0.5'>
                          <Calendar className='w-3.5 h-3.5' />
                          {formatDate(record.exitTime)}
                        </span>
                      </div>
                    ) : (
                      <span className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-600'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></span>
                        Active
                      </span>
                    )}
                  </td>
                  <td className='p-4'>
                    {record.isNeedWashing ? (
                      <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20'>
                        <Droplets className='w-3 h-3' />
                        Wash Req.
                      </span>
                    ) : (
                      <span className='text-xs text-muted-foreground/60'>
                        Parking Only
                      </span>
                    )}
                  </td>
                  <td className='p-4 text-right font-medium text-foreground'>
                    Rp {record.estimatedFee.toLocaleString()}
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center justify-center gap-2'>
                      {!record.exitTime && (
                        <button
                          onClick={() => handleCheckOut(record)}
                          className='flex items-center gap-1 px-2.5 py-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-600 border border-green-500/30 text-xs font-semibold cursor-pointer transition-all'
                        >
                          <CheckCircle className='w-3.5 h-3.5' />
                          Check Out
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(record.id)}
                        className='p-1 rounded text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all cursor-pointer'
                        title='Delete log'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Check In Modal */}
      {isCheckInOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <div className='relative w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200'>
            <button
              onClick={() => setIsCheckInOpen(false)}
              className='absolute right-4 top-4 p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer'
            >
              <X className='w-4 h-4' />
            </button>

            <h2 className='text-xl font-heading font-bold text-foreground m-0 mb-1 flex items-center gap-2'>
              <Bike className='w-5 h-5 text-primary' />
              Check In Motorcycle
            </h2>
            <p className='text-xs text-muted-foreground mb-6'>
              Create a new entry log in the parking system
            </p>

            <form onSubmit={handleCheckInSubmit} className='space-y-4'>
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
                  onClick={() => setIsCheckInOpen(false)}
                  className='px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={checkInMutation.isPending}
                  className='px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 font-medium text-sm cursor-pointer'
                >
                  {checkInMutation.isPending
                    ? 'Submitting...'
                    : 'Register Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
