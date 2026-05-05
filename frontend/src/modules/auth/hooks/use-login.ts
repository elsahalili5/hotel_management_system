import { authApi } from "../api/auth-api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

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