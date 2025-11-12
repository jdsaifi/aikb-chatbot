import { API_BASE_URL } from '../constants';

export interface DocumentPolicy {
    allow_any_of_string?: string[];
}

export interface Document {
    _id: string;
    heading: string;
    subHeading: string;
    description: string;
    content?: string;
    isChunked: boolean;
    updatedAt: string;
    id: string;
    policy?: DocumentPolicy;
}

export interface DocumentsApiResponse {
    status: string;
    data: Document[];
}

export interface DocumentApiResponse {
    status: string;
    data: Document;
}

export interface DocumentSearchRequest {
    tags?: string[];
    search?: string;
}

export const documentService = {
    async getMyDocuments(token: string): Promise<DocumentsApiResponse> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/users/documents/my-documents`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: DocumentsApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('Invalid response format from server');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error(
                'An unexpected error occurred while fetching documents'
            );
        }
    },
    async getDocument(
        documentId: string,
        token: string
    ): Promise<DocumentApiResponse> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/users/documents/my-documents/${documentId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: DocumentApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('Invalid response format from server');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error(
                'An unexpected error occurred while fetching document'
            );
        }
    },
    async searchDocuments(
        searchParams: DocumentSearchRequest,
        token: string
    ): Promise<DocumentsApiResponse> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/users/documents/my-documents/search`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(searchParams),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: DocumentsApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('Invalid response format from server');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error(
                'An unexpected error occurred while searching documents'
            );
        }
    },
};
