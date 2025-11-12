import { useQuery } from '@tanstack/react-query';
import { llmModelService } from '@/services/llmModelService';
import { useAuthStore } from '@/stores/authStore';

export const useLLMModels = () => {
    const { token } = useAuthStore();

    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['llm-models'],
        queryFn: async () => {
            if (!token) {
                throw new Error('No authentication token available');
            }
            const response = await llmModelService.getModels(token);
            return response.data || [];
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    return {
        models: data || [],
        isLoading,
        error: error?.message || null,
        isError,
        refetch,
    };
};
