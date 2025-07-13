CREATE TABLE legal_documents (
  id BIGSERIAL PRIMARY KEY,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by BIGINT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_agreements (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  document_id BIGINT NOT NULL REFERENCES legal_documents(id),
  agreed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(user_id, document_id)
);

CREATE TABLE content_reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_user_id BIGINT,
  reported_content_type TEXT NOT NULL,
  reported_content_id BIGINT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX idx_legal_documents_active ON legal_documents(is_active);
CREATE INDEX idx_user_agreements_user ON user_agreements(user_id);
CREATE INDEX idx_content_reports_status ON content_reports(status);
CREATE INDEX idx_content_reports_content ON content_reports(reported_content_type, reported_content_id);
