import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useKBConversations } from '@/hooks/useKBQuery';
import { MessageSquare, Plus, Bot, FileText, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-separator';

const DocumentSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNewChat = () => {
        navigate('/chat');
    };

    const isActiveRoute = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="w-80 h-full bg-card border-r flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-center mb-4">
                    <img
                        src="/neetiai-logo.png"
                        alt="Knowledge Base"
                        className="w-30 h-20 mx-auto"
                    />
                </div>
                {/* <div className="flex items-center space-x-3 mb-4">
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
                            Your documents
                        </p>
                    </div>
                </div> */}

                <Button className="w-full" variant={'default'} asChild>
                    <Link to="/chat">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Chat
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
        </div>
    );
};

export default DocumentSidebar;
