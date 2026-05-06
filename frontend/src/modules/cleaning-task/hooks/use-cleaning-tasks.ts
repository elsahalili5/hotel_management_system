import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cleaningTaskApi } from '../api/cleaning-task-api'

export const cleaningTaskKeys = {
  all: ['cleaning-tasks'] as const,
  myTasks: ['cleaning-tasks', 'my-tasks'] as const,
}

export function useCleaningTasks() {
  return useQuery({
    queryKey: cleaningTaskKeys.all,
    queryFn: cleaningTaskApi.getAll,
  })
}

export function useMyCleaningTasks() {
  return useQuery({
    queryKey: cleaningTaskKeys.myTasks,
    queryFn: cleaningTaskApi.getMyTasks,
  })
}

export function useCreateCleaningTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cleaningTaskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningTaskKeys.all })
    },
  })
}

export function useUpdateCleaningTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cleaningTaskApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningTaskKeys.all })
    },
  })
}

export function useDeleteCleaningTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cleaningTaskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cleaningTaskKeys.all })
    },
  })
}
