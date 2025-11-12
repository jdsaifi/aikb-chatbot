import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useKBConversations } from '@/hooks/useKBQuery';
import { MessageSquare, Plus, Bot, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-separator';

const ConversationSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: conversations, isLoading, error } = useKBConversations();

    const handleNewChat = () => {
        navigate('/chat');
    };

    const handleConversationClick = (conversationId: string) => {
        navigate(`/chat/${conversationId}`);
    };

    const getFirstUserMessage = (conversation: any) => {
        const userMessage = conversation.history?.find(
            (msg: any) => msg.role === 'user'
        );
        return userMessage?.content || 'New conversation';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (diffInHours < 168) {
            // 7 days
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const isActiveRoute = (path: string) => {
        return location.pathname === path;
    };

    const isActiveConversation = (conversationId: string) => {
        return location.pathname === `/chat/${conversationId}`;
    };

    return (
        <div className="w-80 h-full bg-card border-r flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-semibold">
                            AI Knowledge Base
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Your conversations
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleNewChat}
                    className="w-full"
                    variant={'default'}
                    asChild
                >
                    <Link to="/documents">
                        <FileText className="h-4 w-4 mr-2" />
                        My Documents
                    </Link>
                </Button>
                <Separator className="my-2" />
                <Button
                    onClick={handleNewChat}
                    className="w-full"
                    variant={isActiveRoute('/chat') ? 'default' : 'outline'}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                </Button>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-3">
                                    <div className="h-4 bg-muted rounded mb-2" />
                                    <div className="h-3 bg-muted rounded w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Failed to load conversations
                        </p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            No conversations yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Start a new chat to see your history here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((conversation) => (
                            <Card
                                key={conversation._id}
                                className={cn(
                                    'cursor-pointer transition-colors hover:bg-muted/50',
                                    isActiveConversation(conversation._id) &&
                                        'bg-muted'
                                )}
                                onClick={() =>
                                    handleConversationClick(conversation._id)
                                }
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-start space-x-3">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-2 mb-1">
                                                {getFirstUserMessage(
                                                    conversation
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(
                                                    conversation.updatedAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default ConversationSidebar;
