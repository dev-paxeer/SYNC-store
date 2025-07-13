CREATE TABLE app_submissions (
  id BIGSERIAL PRIMARY KEY,
  developer_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category_id BIGINT NOT NULL,
  icon_url TEXT,
  banner_url TEXT,
  screenshots TEXT[],
  version TEXT NOT NULL,
  apk_url TEXT,
  apk_size BIGINT,
  package_name TEXT,
  min_android_version TEXT,
  target_android_version TEXT,
  permissions TEXT[],
  is_web3 BOOLEAN NOT NULL DEFAULT FALSE,
  blockchain_networks TEXT[],
  wallet_required BOOLEAN NOT NULL DEFAULT FALSE,
  github_repo TEXT,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id BIGINT
);

CREATE TABLE app_analytics (
  id BIGSERIAL PRIMARY KEY,
  app_id BIGINT NOT NULL,
  date DATE NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(app_id, date)
);

CREATE TABLE developer_analytics (
  id BIGSERIAL PRIMARY KEY,
  developer_id BIGINT NOT NULL,
  date DATE NOT NULL,
  total_downloads INTEGER NOT NULL DEFAULT 0,
  total_views INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  active_apps INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(developer_id, date)
);

CREATE TABLE app_changelogs (
  id BIGSERIAL PRIMARY KEY,
  app_id BIGINT NOT NULL,
  version TEXT NOT NULL,
  release_notes TEXT NOT NULL,
  changes JSONB,
  released_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(app_id, version)
);

CREATE INDEX idx_app_submissions_developer ON app_submissions(developer_id);
CREATE INDEX idx_app_submissions_status ON app_submissions(status);
CREATE INDEX idx_app_analytics_app ON app_analytics(app_id);
CREATE INDEX idx_app_analytics_date ON app_analytics(date);
CREATE INDEX idx_developer_analytics_developer ON developer_analytics(developer_id);
CREATE INDEX idx_developer_analytics_date ON developer_analytics(date);
CREATE INDEX idx_app_changelogs_app ON app_changelogs(app_id);
