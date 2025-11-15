import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import { useKBQuery } from '@/hooks/useKBQuery';
import { useLLMModels } from '@/hooks/useLLMModels';
import { Send, LogOut, FileText, Download, Eye, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConversationSidebar from '@/components/ConversationSidebar';
import { KBQueryApiResponse } from '../schemas/kbQuerySchemas';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    documents?: Document[];
}

interface Document {
    id: string;
    title: string;
    url?: string;
    preview?: string;
}

const Chat = () => {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuthStore();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { query: executeKBQuery } = useKBQuery();
    const { models, isLoading: isLoadingModels } = useLLMModels();

    console.log('\n\n\nmodels: ', models);

    // Set default model when models are loaded
    useEffect(() => {
        if (models.length > 0 && !selectedModel) {
            setSelectedModel(models[0].id);
        }
    }, [models, selectedModel]);

    const scrollToBottom = () => {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
            if (scrollAreaRef.current) {
                // Access the viewport element inside ScrollArea
                // Try multiple selectors to find the viewport
                let viewport = scrollAreaRef.current.querySelector(
                    '[data-radix-scroll-area-viewport]'
                ) as HTMLElement;

                if (!viewport) {
                    viewport = scrollAreaRef.current.querySelector(
                        '.h-full.w-full'
                    ) as HTMLElement;
                }

                if (!viewport && scrollAreaRef.current.firstElementChild) {
                    viewport = scrollAreaRef.current
                        .firstElementChild as HTMLElement;
                }

                if (viewport) {
                    viewport.scrollTo({
                        top: viewport.scrollHeight,
                        behavior: 'smooth',
                    });
                }
            }
        });
    };

    useEffect(() => {
        // Scroll to bottom when messages change or loading state changes
        scrollToBottom();
    }, [messages, isLoading]);

    // Scroll to bottom on initial mount
    useEffect(() => {
        scrollToBottom();
    }, []);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Implement the API call to the kbQueryService
        try {
            const response: KBQueryApiResponse = await executeKBQuery(
                conversationId,
                inputValue,
                selectedModel
            );

            if (response && response.data && response.data.length > 0) {
                const kbResponse = response.data[0];
                setConversationId(kbResponse?.conversationId || null);

                // references = [
                //     {
                //       id: new ObjectId('68f74f911c7c1ded3a0f758b'),
                //       title: 'tmformfree-TM-12.pdf',
                //       preview: 'FORM TM -12 \n' +
                //         'THE TRADE MARKS ACT, 1999 \n' +
                //         'Agents code No: \n' +
                //         'Proprietors code No: \n' +
                //         'Fee: See entries Nos....',
                //       path: 'ipr/trademarks/tmformfree-TM-12.pdf'
                //     },
                // ]

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: kbResponse.response,
                    role: 'assistant',
                    timestamp: new Date(),
                    documents: kbResponse.references || [],
                    // [
                    //     // {
                    //     //     id: '1',
                    //     //     title: 'Knowledge Base Response',
                    //     //     url: '#',
                    //     //     preview: `Query: ${kbResponse.query}`,
                    //     // },
                    // ],
                };

                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                // Handle case where no response is returned
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content:
                        "I couldn't find any relevant information in the knowledge base for your query. Please try rephrasing your question or ask about a different topic.",
                    role: 'assistant',
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error('KB Query failed:', error);

            // Handle error case
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content:
                    "I'm sorry, I encountered an error while searching the knowledge base. Please try again or contact support if the issue persists.",
                role: 'assistant',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);

            toast({
                title: 'Query Error',
                description:
                    'Failed to query the knowledge base. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
        toast({
            title: 'Logged out',
            description: 'You have been successfully logged out.',
        });
    };

    const handleDocumentAction = (
        action: 'view' | 'download',
        doc: Document
    ) => {
        if (doc.url) {
            toast({
                title: 'Redirecting',
                description: `Redirecting to ${doc.title}...`,
            });
            const url = `${import.meta.env.VITE_API_ROOTURL}/uploads/${
                doc.url
            }`;
            return window.open(url, '_blank');
        } else {
            toast({
                title: 'Error',
                description: 'No URL found for the document.',
            });
        }

        return;
        // if (action === 'download') {
        //     toast({
        //         title: 'Download Started',
        //         description: `Downloading ${doc.title}...`,
        //     });
        //     // Implement actual download logic here

        // } else {
        //     toast({
        //         title: 'Opening Document',
        //         description: `Opening ${doc.title} for viewing...`,
        //     });
        //     // Implement actual view logic here
        //     if (doc.url) {
        //         const url = `${import.meta.env.VITE_API_ROOTURL}/uploads/${
        //             doc.url
        //         }`;
        //         return window.open(url, '_blank');
        //     } else {
        //         toast({
        //             title: 'Error',
        //             description: 'No URL found for the document.',
        //         });
        //     }
        // }
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <ConversationSidebar />

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-card">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-semibold">Neeti AI</h1>
                            <p className="text-sm text-muted-foreground">
                                {/* AI Assistant */}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">
                            Welcome, {user?.name || user?.email}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Chat Messages */}
                {/* open chat with scroll to bottom */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                    Start a conversation
                                </h3>
                                <p className="text-muted-foreground">
                                    Ask me anything about the knowledge base and
                                    I'll help you find relevant information.
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.role === 'user'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`flex space-x-3 max-w-3xl ${
                                            message.role === 'user'
                                                ? 'flex-row-reverse space-x-reverse'
                                                : ''
                                        }`}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback
                                                className={
                                                    message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary'
                                                }
                                            >
                                                {message.role === 'user' ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <Card
                                                className={
                                                    message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : ''
                                                }
                                            >
                                                <CardContent className="p-3">
                                                    <p className="text-sm">
                                                        {message.content}
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Documents */}
                                            {message.documents &&
                                                message.documents.length >
                                                    0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-muted-foreground font-medium">
                                                            Reference Documents:
                                                        </p>
                                                        {message.documents.map(
                                                            (doc) => (
                                                                <Card
                                                                    key={doc.id}
                                                                    className="border-l-4 border-l-primary"
                                                                >
                                                                    <CardContent className="p-3">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center space-x-2 mb-1">
                                                                                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                                                                    <h4 className="text-sm font-medium truncate">
                                                                                        {
                                                                                            doc.title
                                                                                        }
                                                                                    </h4>
                                                                                </div>
                                                                                {doc.preview && (
                                                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                                                        {
                                                                                            doc.preview
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex space-x-1 ml-2">
                                                                                {/* <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    onClick={() =>
                                                                                        handleDocumentAction(
                                                                                            'view',
                                                                                            doc
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Eye className="h-3 w-3" />
                                                                                </Button> */}
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    onClick={() =>
                                                                                        handleDocumentAction(
                                                                                            'download',
                                                                                            doc
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Download className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex space-x-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-secondary">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <Card>
                                        <CardContent className="p-3">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-card">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex space-x-2">
                            {/* llm model selector */}
                            <Select
                                value={selectedModel}
                                onValueChange={setSelectedModel}
                                disabled={isLoadingModels || isLoading}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue
                                        placeholder={
                                            isLoadingModels
                                                ? 'Loading models...'
                                                : 'Select model'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {models.map((model) => (
                                        <SelectItem
                                            key={model.id}
                                            value={model.id}
                                        >
                                            {model.title} ({model.provider})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about the knowledge base..."
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                size="icon"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
