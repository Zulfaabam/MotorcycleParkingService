import React from 'react'
import {
  RefreshCw,
  EyeOff,
  Clock,
  Calendar,
  Droplets,
  CheckCircle,
  Edit2,
  Trash2,
} from 'lucide-react'
import type { ParkingRecordDto } from '../../types'

interface ParkingTableProps {
  records: ParkingRecordDto[]
  isLoading: boolean
  onCheckOutClick: (record: ParkingRecordDto) => void
  onEditClick: (record: ParkingRecordDto) => void
  onDeleteClick: (id: string) => void
}

export const ParkingTable: React.FC<ParkingTableProps> = ({
  records,
  isLoading,
  onCheckOutClick,
  onEditClick,
  onDeleteClick,
}) => {
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
              <td
                colSpan={7}
                className='p-8 text-center text-muted-foreground'
              >
                <div className='flex items-center justify-center gap-2'>
                  <RefreshCw className='w-5 h-5 animate-spin text-primary' />
                  <span>Loading logs...</span>
                </div>
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className='p-12 text-center text-muted-foreground'
              >
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
            records.map((record) => (
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
                      Not specified
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
                        onClick={() => onCheckOutClick(record)}
                        className='flex items-center gap-1 px-2.5 py-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-600 border border-green-500/30 text-xs font-semibold cursor-pointer transition-all'
                      >
                        <CheckCircle className='w-3.5 h-3.5' />
                        Check Out
                      </button>
                    )}
                    <button
                      onClick={() => onEditClick(record)}
                      className='p-1 rounded text-blue-300 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all cursor-pointer'
                      title='Edit log'
                    >
                      <Edit2 className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => onDeleteClick(record.id)}
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
  )
}
