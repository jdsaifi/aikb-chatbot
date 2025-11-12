import { API_BASE_URL } from '../constants';

export interface LLMModel {
    id: string;
    name: string;
    provider?: string;
    [key: string]: any; // Allow for additional properties
}

export interface LLMModelsApiResponse {
    status: string;
    data: LLMModel[];
}

export const llmModelService = {
    async getModels(token: string): Promise<LLMModelsApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/llm-models`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: LLMModelsApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('Invalid response format from server');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error(
                'An unexpected error occurred while fetching LLM models'
            );
        }
    },
};
