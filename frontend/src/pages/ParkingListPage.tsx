import React, { useState } from 'react'
import { toast } from 'sonner'
import { CheckInModal } from '../components/CheckInModal'
import { ConfirmModal } from '../components/ConfirmModal'
import { ParkingHeader } from '../components/Parking/ParkingHeader'
import { ParkingFilters } from '../components/Parking/ParkingFilters'
import { ParkingTable } from '../components/Parking/ParkingTable'
import { useParkingRecords } from '../hooks/useParkingRecords'
import { useParkingMutations } from '../hooks/useParkingMutations'
import type { ParkingRecordDto, UpdateParkingRecordDto } from '../types'

export const ParkingListPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'completed'
  >('all')
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingRecord, setEditingRecord] = useState<ParkingRecordDto | null>(
    null,
  )

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<
    'delete' | 'checkout' | null
  >(null)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)
  const [recordToCheckout, setRecordToCheckout] =
    useState<ParkingRecordDto | null>(null)

  // Fetch parking records
  const { data: response, isLoading, isRefetching, refetch } = useParkingRecords()
  const records = response?.data || []

  // Mutations
  const { checkInMutation, editMutation, checkOutMutation, deleteMutation } =
    useParkingMutations()

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

  const handleSubmit = (data: {
    licensePlate: string
    isNeedWashing: boolean
    notes: string
  }) => {
    if (!data.licensePlate.trim()) {
      toast.error('License plate is required')
      return
    }

    if (modalMode === 'add') {
      checkInMutation.mutate(
        {
          motorcycleLicensePlate: data.licensePlate.toUpperCase(),
          isNeedWashing: data.isNeedWashing,
          notes: data.notes,
        },
        {
          onSuccess: () => setIsCheckInOpen(false),
        },
      )
    } else if (modalMode === 'edit' && editingRecord) {
      editMutation.mutate(
        {
          id: editingRecord.id,
          data: {
            motorcycleLicensePlate: data.licensePlate.toUpperCase(),
            entryTime: editingRecord.entryTime,
            exitTime: editingRecord.exitTime,
            estimatedFee: editingRecord.estimatedFee,
            isNeedWashing: data.isNeedWashing,
            notes: data.notes,
          },
        },
        {
          onSuccess: () => {
            setIsCheckInOpen(false)
            setEditingRecord(null)
          },
        },
      )
    }
  }

  const handleAddClick = () => {
    setModalMode('add')
    setEditingRecord(null)
    setIsCheckInOpen(true)
  }

  const handleEditClick = (record: ParkingRecordDto) => {
    setModalMode('edit')
    setEditingRecord(record)
    setIsCheckInOpen(true)
  }

  const handleCheckOutClick = (record: ParkingRecordDto) => {
    setPendingAction('checkout')
    setRecordToCheckout(record)
    setRecordToDelete(null)
    setIsConfirmOpen(true)
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

  const handleDeleteClick = (id: string) => {
    setPendingAction('delete')
    setRecordToDelete(id)
    setRecordToCheckout(null)
    setIsConfirmOpen(true)
  }

  const confirmAction = () => {
    if (pendingAction === 'checkout' && recordToCheckout) {
      handleCheckOut(recordToCheckout)
      setIsConfirmOpen(false)
      setPendingAction(null)
      setRecordToCheckout(null)
      return
    }

    if (pendingAction === 'delete' && recordToDelete) {
      deleteMutation.mutate(recordToDelete, {
        onSuccess: () => {
          setIsConfirmOpen(false)
          setRecordToDelete(null)
        },
        onError: () => {
          setIsConfirmOpen(false)
        },
      })
    }
  }

  const cancelConfirmAction = () => {
    setIsConfirmOpen(false)
    setPendingAction(null)
    setRecordToDelete(null)
    setRecordToCheckout(null)
  }

  return (
    <div className='flex flex-col gap-8 w-full'>
      <ParkingHeader
        onRefetch={refetch}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onAddClick={handleAddClick}
      />

      <ParkingFilters
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <ParkingTable
        records={filteredRecords}
        isLoading={isLoading}
        onCheckOutClick={handleCheckOutClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* Check In Modal */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={
          modalMode === 'add'
            ? checkInMutation.isPending
            : editMutation.isPending
        }
        mode={modalMode}
        initialData={
          editingRecord
            ? {
                licensePlate: editingRecord.motorcycleLicensePlate,
                isNeedWashing: editingRecord.isNeedWashing,
                notes: editingRecord.notes || '',
              }
            : null
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title={
          pendingAction === 'checkout'
            ? 'Confirm Check Out'
            : 'Delete Parking Record'
        }
        message={
          pendingAction === 'checkout'
            ? 'Are you sure you want to check out this motorcycle? The parking fee will be calculated and recorded.'
            : 'Are you sure you want to delete this parking record? This action cannot be undone.'
        }
        confirmText={pendingAction === 'checkout' ? 'Check Out' : 'Delete'}
        onConfirm={confirmAction}
        onCancel={cancelConfirmAction}
        isProcessing={
          pendingAction === 'checkout'
            ? checkOutMutation.isPending
            : deleteMutation.isPending
        }
        variant={pendingAction === 'checkout' ? 'warning' : 'danger'}
      />
    </div>
  )
}
