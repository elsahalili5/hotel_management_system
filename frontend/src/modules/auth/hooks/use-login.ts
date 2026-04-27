import { authApi } from "../api/auth-api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../auth-context";

export function useLogin() {
    const auth = useAuth();

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            auth.setSession(data)
        },
    })
    
    return loginMutation
}