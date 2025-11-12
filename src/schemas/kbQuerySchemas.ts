export interface KBQueryRequest {
    conversationId?: string;
    query: string;
    model: string;
}

export interface Reference {
    id: string;
    title: string;
    preview?: string;
    url?: string; // for pdf files
}

export interface KBQueryResponse {
    conversationId: string;
    query: string;
    response: string;
    references: Reference[];
}

export interface KBQueryApiResponse {
    status: string;
    data: KBQueryResponse[];
}

export interface KBQueryError {
    message: string;
    status?: number;
}

export interface KBConversationApiResponse {
    status: string;
    data: KBConversationResponse[];
}

export interface KBConversationHistory {
    _id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}

export interface KBConversationResponse {
    _id: string;
    user: string;
    history: KBConversationHistory[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
}

export interface KBConversationsListApiResponse {
    status: string;
    data: KBConversationResponse[];
}
