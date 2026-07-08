import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parkingApi } from '../api/api'
import { type CreateParkingRecordDto, type UpdateParkingRecordDto } from '../types'
import { toast } from 'sonner'

export const useParkingMutations = () => {
  const queryClient = useQueryClient()

  const checkInMutation = useMutation({
    mutationFn: (data: CreateParkingRecordDto) => parkingApi.create(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Motorcycle checked in successfully')
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

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParkingRecordDto }) =>
      parkingApi.update(id, data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Record updated successfully')
        queryClient.invalidateQueries({ queryKey: ['parkingRecords'] })
      } else {
        toast.error(res.errors[0] || 'Update failed')
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.errors?.[0] || 'Failed to update record')
    },
  })

  const checkOutMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParkingRecordDto }) =>
      parkingApi.update(id, data),
    onSuccess: (res) => {
      if (res.success && res.data) {
        toast.success(
          `Check-out complete! Fee: Rp ${res.data.estimatedFee.toLocaleString()}`,
        )
        queryClient.invalidateQueries({ queryKey: ['parkingRecords'] })
      } else {
        toast.error(res.errors?.[0] || 'Check-out failed')
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

  return {
    checkInMutation,
    editMutation,
    checkOutMutation,
    deleteMutation,
  }
}
