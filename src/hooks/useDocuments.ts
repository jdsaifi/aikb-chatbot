import { useQuery } from '@tanstack/react-query';
import {
    documentService,
    DocumentSearchRequest,
} from '@/services/documentService';
import { useAuthStore } from '@/stores/authStore';

export const useDocuments = (searchParams?: DocumentSearchRequest) => {
    const { token } = useAuthStore();

    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: ['documents', searchParams],
        queryFn: async () => {
            if (!token) {
                throw new Error('No authentication token available');
            }

            // Use search API if search parameters are provided
            if (
                searchParams &&
                (searchParams.tags?.length || searchParams.search)
            ) {
                const response = await documentService.searchDocuments(
                    searchParams,
                    token
                );
                return response.data || [];
            }

            // Otherwise use the regular get documents API
            const response = await documentService.getMyDocuments(token);
            return response.data || [];
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    return {
        documents: data || [],
        isLoading,
        error: error?.message || null,
        isError,
        refetch,
    };
};
