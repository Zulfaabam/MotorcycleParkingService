import { useQuery } from '@tanstack/react-query'
import { parkingApi } from '../api/api'

export const useParkingRecords = () => {
  return useQuery({
    queryKey: ['parkingRecords'],
    queryFn: parkingApi.getAll,
  })
}
