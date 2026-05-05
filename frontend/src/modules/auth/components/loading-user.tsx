export function LoadingUser() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"
                role="status"
                aria-label="Loading"
            />
        </div>
    )
}

export default LoadingUser;