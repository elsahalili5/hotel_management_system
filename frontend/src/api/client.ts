import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

import { AUTH_STORAGE_KEY } from '#/modules/auth/components/auth-context'

export type ApiClient = {
  get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse>
  post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ): Promise<TResponse>
  put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ): Promise<TResponse>
  patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ): Promise<TResponse>
  delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse>
  request<TResponse, TBody = unknown>(
    config: AxiosRequestConfig<TBody>,
  ): Promise<TResponse>
}

export const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem(AUTH_STORAGE_KEY)
  const authToken = authStorage ? JSON.parse(authStorage).accessToken : null

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

// let isRefreshing = false
// let failedQueue: Array<{
//   resolve: (token: string) => void
//   reject: (err: unknown) => void
// }> = []

// const processQueue = (error: unknown, token: string | null) => {
//   failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
//   failedQueue = []
// }

// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const original = error.config as AxiosRequestConfig & { _retry?: boolean }

//     if (error.response?.status !== 401 || original._retry) {
//       return Promise.reject(error)
//     }

//     if (isRefreshing) {
//       return new Promise<string>((resolve, reject) => {
//         failedQueue.push({ resolve, reject })
//       }).then((token) => {
//         original.headers = {
//           ...original.headers,
//           Authorization: `Bearer ${token}`,
//         }
//         return axiosClient(original)
//       })
//     }

//     original._retry = true
//     isRefreshing = true

//     const stored = localStorage.getItem(AUTH_STORAGE_KEY)
//     const refreshToken = stored ? JSON.parse(stored).refreshToken : null

//     if (!refreshToken) {
//       isRefreshing = false
//       localStorage.removeItem(AUTH_STORAGE_KEY)
//       window.location.href = '/login'
//       return Promise.reject(error)
//     }

//     try {
//       const res = await axiosClient.post<{
//         data: { accessToken: string; refreshToken: string }
//       }>('/auth/refresh-token', { refreshToken })
//       const tokens = res.data?.data ?? (res.data as any)
//       const newAccess: string = tokens.accessToken
//       const newRefresh: string = tokens.refreshToken

//       const parsed = stored ? JSON.parse(stored) : {}
//       localStorage.setItem(
//         AUTH_STORAGE_KEY,
//         JSON.stringify({
//           ...parsed,
//           accessToken: newAccess,
//           refreshToken: newRefresh,
//         }),
//       )

//       axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`
//       original.headers = {
//         ...original.headers,
//         Authorization: `Bearer ${newAccess}`,
//       }
//       processQueue(null, newAccess)
//       return axiosClient(original)
//     } catch (refreshError) {
//       processQueue(refreshError, null)
//       localStorage.removeItem(AUTH_STORAGE_KEY)
//       window.location.href = '/login'
//       return Promise.reject(refreshError)
//     } finally {
//       isRefreshing = false
//     }
//   },
// )

type ApiEnvelope<TResponse> = {
  data: TResponse
}

const isApiEnvelope = <TResponse>(
  payload: TResponse | ApiEnvelope<TResponse>,
): payload is ApiEnvelope<TResponse> =>
  typeof payload === 'object' && payload !== null && 'data' in payload

const getData = <TResponse>(
  response: AxiosResponse<TResponse | ApiEnvelope<TResponse>>,
) => {
  const payload = response.data
  return isApiEnvelope(payload) ? payload.data : payload
}

export const apiClient: ApiClient = {
  get: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosClient.get<TResponse>(url, config).then(getData),
  post: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) => axiosClient.post<TResponse>(url, body, config).then(getData),
  put: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) => axiosClient.put<TResponse>(url, body, config).then(getData),
  patch: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) => axiosClient.patch<TResponse>(url, body, config).then(getData),
  delete: <TResponse>(url: string, config?: AxiosRequestConfig) =>
    axiosClient.delete<TResponse>(url, config).then(getData),
  request: <TResponse, TBody = unknown>(config: AxiosRequestConfig<TBody>) =>
    axiosClient.request<TResponse>(config).then(getData),
}

export const isApiError = (error: unknown): error is AxiosError =>
  axios.isAxiosError(error)
