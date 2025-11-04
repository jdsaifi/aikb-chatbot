import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useLogout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogout = () => {
        logout();
        navigate('/auth');
        toast({
            title: 'Logged out',
            description: 'You have been successfully logged out.',
        });
    };

    return { handleLogout };
};
