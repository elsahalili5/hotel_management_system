import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/user-api'

export const userKeys = {
  all: ['users'] as const,
  detail: (id: number) => ['users', id] as const,
}

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: userApi.getAll,
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getById(id),
  })
}

export function useCreateGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.createGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useCreateStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
