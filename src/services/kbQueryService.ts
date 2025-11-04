import {
    KBQueryRequest,
    KBQueryApiResponse,
    KBQueryError,
    KBConversationApiResponse,
    KBConversationsListApiResponse,
} from '@/schemas/kbQuerySchemas';
import { API_BASE_URL } from '../constants';

export const kbQueryService = {
    async query(
        payload: KBQueryRequest,
        token: string
    ): Promise<KBQueryApiResponse> {
        try {
            // used: ${API_BASE_URL}/kbs/query
            ///admins/samples/documents/ai-search
            const response = await fetch(
                `${API_BASE_URL}/admins/samples/documents/ai-search`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: KBQueryApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('Invalid response format from server');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unexpected error occurred during KB query');
        }
    },
    async getConversation(
        conversationId: string,
        token: string
    ): Promise<KBConversationApiResponse> {
        const response = await fetch(
            `${API_BASE_URL}/kbs/conversations/${conversationId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: KBConversationApiResponse = await response.json();

        if (data.status !== 'success') {
            throw new Error('Invalid response format from server');
        }

        // console.log('get conversation data:', data);

        return data;
    },
    async getConversations(
        token: string
    ): Promise<KBConversationsListApiResponse> {
        const response = await fetch(`${API_BASE_URL}/kbs/conversations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: KBConversationsListApiResponse = await response.json();

        if (data.status !== 'success') {
            throw new Error('Invalid response format from server');
        }

        return data;
    },
};
