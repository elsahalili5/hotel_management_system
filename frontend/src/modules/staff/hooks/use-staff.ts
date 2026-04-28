import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { staffApi } from '../api/staff-api'

export const staffKeys = {
  all: ['staff'] as const,
  detail: (id: number) => ['staff', id] as const,
}

export function useStaff() {
  return useQuery({
    queryKey: staffKeys.all,
    queryFn: staffApi.getAll,
  })
}

export function useStaffMember(id: number) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getById(id),
  })
}

export function useUpdateStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: staffApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(id) })
    },
  })
}
