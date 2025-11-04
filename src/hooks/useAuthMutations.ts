import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { LoginFormData, SignupFormData } from '@/schemas/authSchemas';
import { useToast } from '@/hooks/use-toast';

export const useLoginMutation = () => {
    const { login, setLoading } = useAuthStore();
    const { toast } = useToast();

    return useMutation({
        mutationFn: authService.login,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            login(data.user, data.token);
            toast({
                title: 'Welcome back!',
                description: data.message || 'You have successfully logged in.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Login Failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};

export const useSignupMutation = () => {
    const { login, setLoading } = useAuthStore();
    const { toast } = useToast();

    return useMutation({
        mutationFn: authService.signup,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: (data) => {
            login(data.user, data.token);
            toast({
                title: 'Account Created!',
                description:
                    data.message ||
                    'Your account has been created successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Signup Failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};
