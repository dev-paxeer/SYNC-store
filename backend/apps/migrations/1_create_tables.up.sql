CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  is_web3 BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE developers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  github_username TEXT,
  website TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE apps (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  developer_id BIGINT NOT NULL REFERENCES developers(id),
  category_id BIGINT NOT NULL REFERENCES categories(id),
  icon_url TEXT,
  banner_url TEXT,
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
  smart_contract_verified BOOLEAN NOT NULL DEFAULT FALSE,
  github_repo TEXT,
  website_url TEXT,
  downloads_count BIGINT NOT NULL DEFAULT 0,
  rating_average DOUBLE PRECISION NOT NULL DEFAULT 0,
  rating_count BIGINT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE app_screenshots (
  id BIGSERIAL PRIMARY KEY,
  app_id BIGINT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE app_reviews (
  id BIGSERIAL PRIMARY KEY,
  app_id BIGINT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  helpful_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE app_downloads (
  id BIGSERIAL PRIMARY KEY,
  app_id BIGINT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  user_ip TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_apps_category ON apps(category_id);
CREATE INDEX idx_apps_developer ON apps(developer_id);
CREATE INDEX idx_apps_published ON apps(published);
CREATE INDEX idx_apps_featured ON apps(featured);
CREATE INDEX idx_apps_is_web3 ON apps(is_web3);
CREATE INDEX idx_apps_rating ON apps(rating_average DESC);
CREATE INDEX idx_apps_downloads ON apps(downloads_count DESC);
CREATE INDEX idx_app_reviews_app ON app_reviews(app_id);
CREATE INDEX idx_app_downloads_app ON app_downloads(app_id);
