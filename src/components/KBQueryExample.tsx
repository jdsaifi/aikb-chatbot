import React, { useState } from 'react';
import { useKBQuery } from '@/hooks/useKBQuery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search } from 'lucide-react';

export const KBQueryExample: React.FC = () => {
    const [query, setQuery] = useState('');
    const {
        query: executeQuery,
        isLoading,
        error,
        data,
        isSuccess,
        reset,
    } = useKBQuery();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            try {
                await executeQuery(query);
            } catch (err) {
                console.error('Query failed:', err);
            }
        }
    };

    const handleReset = () => {
        setQuery('');
        reset();
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Knowledge Base Query
                    </CardTitle>
                    <CardDescription>
                        Ask questions about your knowledge base content
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="What are the Wireframes and where they have been used?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={isLoading || !query.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Querying...
                                    </>
                                ) : (
                                    'Query KB'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isSuccess && data && (
                <Card>
                    <CardHeader>
                        <CardTitle>Query Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.data.map((result, index) => (
                            <div key={index} className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Query: {result.query}
                                </div>
                                <div className="p-3 bg-muted rounded-md">
                                    {result.response}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
