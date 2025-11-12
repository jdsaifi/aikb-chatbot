import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { kbQueryService } from '@/services/kbQueryService';
import { KBQueryRequest, KBQueryApiResponse } from '@/schemas/kbQuerySchemas';
import { useAuthStore } from '@/stores/authStore';

export const useKBQuery = () => {
    const { token } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (
            payload: KBQueryRequest
        ): Promise<KBQueryApiResponse> => {
            if (!token) {
                throw new Error('No authentication token available');
            }
            return kbQueryService.query(payload, token);
        },
        onMutate: () => {
            setIsLoading(true);
            setError(null);
        },
        onSuccess: () => {
            setIsLoading(false);
        },
        onError: (error: Error) => {
            setIsLoading(false);
            setError(error.message);
        },
    });

    const query = async (
        conversationId: string,
        queryString: string,
        modelId: string
    ) => {
        if (!queryString?.trim()) {
            setError('Query cannot be empty');
            return;
        }

        return mutation.mutateAsync({
            query: queryString,
            conversationId,
            model: modelId,
        });
    };

    return {
        query,
        isLoading: isLoading || mutation.isPending,
        error: error || mutation.error?.message || null,
        data: mutation.data,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        reset: () => {
            mutation.reset();
            setError(null);
        },
    };
};

export const useKBConversation = (conversationId: string) => {
    const { token } = useAuthStore();
    const { data, isLoading, error, isSuccess } = useQuery({
        queryKey: ['conversation', conversationId],
        queryFn: () => kbQueryService.getConversation(conversationId, token),
    });

    return {
        data: isSuccess ? data.data[0] : null,
        isLoading,
        error,
        isSuccess,
    };
};

export const useKBConversations = () => {
    const { token } = useAuthStore();
    const { data, isLoading, error, isSuccess } = useQuery({
        queryKey: ['conversations'],
        queryFn: () => kbQueryService.getConversations(token),
        enabled: !!token,
    });

    return {
        data: isSuccess ? data.data : [],
        isLoading,
        error,
        isSuccess,
    };
};
