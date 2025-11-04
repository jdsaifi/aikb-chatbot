import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'txt' | 'other';
}

interface ChatMessageProps {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  documents?: Document[];
}

const ChatMessage = ({ content, isUser, timestamp, documents }: ChatMessageProps) => {
  const [showDocuments, setShowDocuments] = useState(false);

  const handleDownload = (doc: Document) => {
    // Create a temporary link to download the document
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (doc: Document) => {
    // Open document in new tab
    window.open(doc.url, '_blank');
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-4xl mx-auto p-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary" : "bg-muted"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        <Card className={cn(
          "p-3 max-w-[80%]",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted"
        )}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
        </Card>

        {/* Documents */}
        {documents && documents.length > 0 && (
          <div className={cn(
            "space-y-2",
            isUser ? "flex flex-col items-end" : "flex flex-col items-start"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocuments(!showDocuments)}
              className="text-xs"
            >
              {documents.length} reference document{documents.length > 1 ? 's' : ''}
            </Button>

            {showDocuments && (
              <div className="space-y-2 w-full max-w-md">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getFileIcon(doc.type)}
                        <span className="text-sm font-medium truncate">
                          {doc.title}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {doc.type.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(doc)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className={cn(
          "text-xs text-muted-foreground",
          isUser ? "text-right" : "text-left"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;