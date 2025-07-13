import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Shield, Users, Scale } from 'lucide-react';
import backend from '~backend/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DOCUMENT_ICONS = {
  terms_of_service: Scale,
  privacy_policy: Shield,
  community_guidelines: Users,
  default: FileText
};

const DOCUMENT_TITLES = {
  terms_of_service: 'Terms of Service',
  privacy_policy: 'Privacy Policy',
  community_guidelines: 'Community Guidelines'
};

export function LegalPage() {
  const { documentType } = useParams<{ documentType: string }>();

  const { data: documentData, isLoading } = useQuery({
    queryKey: ['legal-document', documentType],
    queryFn: () => backend.legal.getDocument({ document_type: documentType! }),
    enabled: !!documentType,
  });

  const { data: allDocuments } = useQuery({
    queryKey: ['legal-documents'],
    queryFn: () => backend.legal.listDocuments(),
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-8" />
          <div className="h-96 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  // If no specific document type, show all documents
  if (!documentType) {
    return (
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Legal Documents</h1>
          <p className="text-muted-foreground">
            Important legal information and policies for Web3Store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDocuments?.documents.map((doc) => {
            const Icon = DOCUMENT_ICONS[doc.document_type as keyof typeof DOCUMENT_ICONS] || DOCUMENT_ICONS.default;
            
            return (
              <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{doc.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">Version {doc.version}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(doc.effective_date).toLocaleDateString()}
                    </span>
                  </div>
                  <a 
                    href={`/legal/${doc.document_type}`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Read Document →
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Document Not Found</h1>
          <p className="text-muted-foreground">
            The legal document you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const document = documentData.document;
  const Icon = DOCUMENT_ICONS[document.document_type as keyof typeof DOCUMENT_ICONS] || DOCUMENT_ICONS.default;

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Icon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{document.title}</h1>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Badge variant="secondary">Version {document.version}</Badge>
          <span>Effective Date: {new Date(document.effective_date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Document Content */}
      <Card>
        <CardContent className="pt-6">
          <div 
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: document.content.replace(/\n/g, '<br>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>') 
            }}
          />
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          If you have any questions about this document, please{' '}
          <a href="mailto:legal@web3store.com" className="text-primary hover:text-primary/80">
            contact our legal team
          </a>
          .
        </p>
      </div>
    </div>
  );
}
