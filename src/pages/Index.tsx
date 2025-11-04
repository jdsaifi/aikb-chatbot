import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { MessageSquare, Bot, FileText, Users, LogOut } from 'lucide-react';

const Index = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/chat');
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Bot className="h-6 w-6 text-primary" />
                        <span className="font-semibold">
                            Knowledge Base Chat
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
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
            </header>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Bot className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Knowledge Base Chat
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Get instant answers from our AI assistant powered by
                        your knowledge base. Chat naturally and access relevant
                        documents with ease.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/chat')}
                            className="text-lg px-8 py-3"
                        >
                            Start Chatting
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/chat')}
                            className="text-lg px-8 py-3"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Why Choose Our AI Assistant?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Experience the power of AI-driven knowledge management
                        with our intuitive chat interface.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="text-center p-6">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <MessageSquare className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>Natural Conversation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Ask questions in plain English and get
                                intelligent responses from our AI assistant.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center p-6">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <FileText className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>Document Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                View and download reference documents directly
                                from the chat interface.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center p-6">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <Users className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>Secure & Personal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Your conversations are private and secure with
                                Google authentication support.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-muted/50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of users who are already using our AI
                        assistant to access knowledge faster.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate('/chat')}
                        className="text-lg px-8 py-3"
                    >
                        Start Chatting Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Index;
