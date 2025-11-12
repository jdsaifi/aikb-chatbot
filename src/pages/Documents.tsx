import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { FileText, LogOut, Loader2, Eye, Search } from 'lucide-react';
import DocumentSidebar from '../components/DocumentSidebar';
import { useAuthStore } from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { useDocuments } from '../hooks/useDocuments';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';

const Documents = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [selectedTag, setSelectedTag] = useState<string | undefined>(
        undefined
    );
    const [searchText, setSearchText] = useState<string>('');

    // Build search parameters
    const searchParams = {
        ...(selectedTag ? { tags: [selectedTag] } : {}),
        ...(searchText.trim() ? { search: searchText.trim() } : {}),
    };

    const { documents, isLoading, error } = useDocuments(
        Object.keys(searchParams).length > 0 ? searchParams : undefined
    );

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <DocumentSidebar />
            {/* Main Chat Area */}
            <div className="flex flex-col flex-1">
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
                                Your documents
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

                {/* main content */}
                <div className="flex flex-col flex-1 overflow-auto p-6">
                    {/* Filters - Always visible */}
                    <div className="mb-4">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search by heading, subHeading, or description..."
                                        value={searchText}
                                        onChange={(e) =>
                                            setSearchText(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-48">
                                <Select
                                    value={selectedTag}
                                    onValueChange={(value) =>
                                        setSelectedTag(value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by tag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {user?.tags &&
                                            user.tags.length > 0 &&
                                            user.tags.map((tag) => (
                                                <SelectItem
                                                    key={tag}
                                                    value={tag}
                                                >
                                                    {tag}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {(selectedTag || searchText.trim()) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedTag('');
                                        setSearchText('');
                                    }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-destructive">Error: {error}</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">
                                No documents found
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Heading</TableHead>
                                        <TableHead>Policy</TableHead>
                                        <TableHead>Chunked</TableHead>
                                        <TableHead>Updated At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc) => (
                                        <TableRow key={doc.id || doc._id}>
                                            <TableCell className="font-medium">
                                                {doc.heading}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {doc.policy
                                                        ?.allow_any_of_string &&
                                                    doc.policy
                                                        .allow_any_of_string
                                                        .length > 0 ? (
                                                        doc.policy.allow_any_of_string.map(
                                                            (tag, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">
                                                            No tags
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        doc.isChunked
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                >
                                                    {doc.isChunked
                                                        ? 'Yes'
                                                        : 'No'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(doc.updatedAt)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        to={`/documents/${doc.id}`}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Documents;
