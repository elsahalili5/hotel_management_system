import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewApi } from '../api/review-api'

export const reviewKeys = {
  all: ['reviews'] as const,
}

export function useReviews() {
  return useQuery({
    queryKey: reviewKeys.all,
    queryFn: reviewApi.getAll,
  })
}

export function useApproveReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    },
  })
}
