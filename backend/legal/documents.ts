import { api } from "encore.dev/api";
import { legalDB } from "./db";

interface GetDocumentRequest {
  document_type: string;
}

interface LegalDocument {
  id: number;
  document_type: string;
  title: string;
  content: string;
  version: string;
  effective_date: Date;
}

interface DocumentResponse {
  document: LegalDocument;
}

interface ListDocumentsResponse {
  documents: LegalDocument[];
}

// Gets a specific legal document by type.
export const getDocument = api<GetDocumentRequest, DocumentResponse>(
  { expose: true, method: "GET", path: "/legal/:document_type" },
  async ({ document_type }) => {
    const document = await legalDB.queryRow<LegalDocument>`
      SELECT id, document_type, title, content, version, effective_date
      FROM legal_documents 
      WHERE document_type = ${document_type} AND is_active = true
      ORDER BY effective_date DESC
      LIMIT 1
    `;

    if (!document) {
      throw new Error("document not found");
    }

    return { document };
  }
);

// Lists all active legal documents.
export const listDocuments = api<void, ListDocumentsResponse>(
  { expose: true, method: "GET", path: "/legal" },
  async () => {
    const documents = await legalDB.queryAll<LegalDocument>`
      SELECT DISTINCT ON (document_type) 
        id, document_type, title, content, version, effective_date
      FROM legal_documents 
      WHERE is_active = true
      ORDER BY document_type, effective_date DESC
    `;

    return { documents };
  }
);
