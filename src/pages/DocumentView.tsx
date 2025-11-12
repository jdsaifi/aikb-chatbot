import { useQuery } from '@tanstack/react-query';
import DocumentSidebar from '../components/DocumentSidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { documentService } from '../services/documentService';
import { useAuthStore } from '../stores/authStore';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const DocumentView = () => {
    const { documentId } = useParams();
    const { token } = useAuthStore();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const {
        data: document,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['document', documentId],
        queryFn: async () => {
            if (!documentId) {
                throw new Error('Document ID is required');
            }
            if (!token) {
                throw new Error('No authentication token available');
            }
            const response = await documentService.getDocument(
                documentId,
                token
            );
            return response.data[0];
        },
        enabled: !!documentId && !!token,
    });

    console.log(document);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-background">
                <DocumentSidebar />
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between p-4 border-b bg-card">
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <div className="flex flex-col flex-1 p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-background">
                <DocumentSidebar />
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between p-4 border-b bg-card">
                        <h1 className="text-xl font-semibold">Document View</h1>
                    </div>
                    <div className="flex flex-col flex-1 items-center justify-center p-6">
                        <p className="text-destructive">
                            {error instanceof Error
                                ? error.message
                                : 'Failed to load document'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="flex h-screen bg-background">
                <DocumentSidebar />
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between p-4 border-b bg-card">
                        <h1 className="text-xl font-semibold">Document View</h1>
                    </div>
                    <div className="flex flex-col flex-1 items-center justify-center p-6">
                        <p className="text-muted-foreground">
                            Document not found
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <DocumentSidebar />
            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-card">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <FileText className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-semibold">Documents</h1>
                            <p className="text-sm text-muted-foreground">
                                View your document
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
                {/* Main content */}
                <div className="flex flex-col flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto w-full space-y-6">
                        {/* Tags Section */}
                        <div className="flex flex-row gap-2 justify-between">
                            <div>
                                {document.heading && (
                                    <h1 className="text-2xl font-semibold mb-0">
                                        {document.heading}
                                    </h1>
                                )}
                                <div>
                                    {document.policy && (
                                        <>
                                            {document.policy.allow_any_of_string?.map(
                                                (tag: any) => (
                                                    <Badge
                                                        variant="secondary"
                                                        key={tag}
                                                        className="mr-1"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Button variant="outline" asChild>
                                    <Link to="/documents">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2"></div>

                        {/* Document Info */}
                        {document.subHeading && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">
                                    {document.subHeading}
                                </h2>
                            </div>
                        )}

                        {document.description && (
                            <div>
                                <p className="text-muted-foreground">
                                    {document.description}
                                </p>
                            </div>
                        )}

                        {/* Document Content */}
                        {document.content && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Content
                                </h3>
                                <div className="prose prose-sm max-w-none bg-card p-6 rounded-lg border">
                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                        {document.content}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {!document.content && (
                            <div className="mt-6">
                                <p className="text-muted-foreground">
                                    No content available for this document.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentView;
