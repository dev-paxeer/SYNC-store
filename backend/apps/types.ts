export interface App {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  developer_id: number;
  category_id: number;
  icon_url?: string;
  banner_url?: string;
  version: string;
  apk_url?: string;
  apk_size?: number;
  package_name?: string;
  min_android_version?: string;
  target_android_version?: string;
  permissions?: string[];
  is_web3: boolean;
  blockchain_networks?: string[];
  wallet_required: boolean;
  smart_contract_verified: boolean;
  github_repo?: string;
  website_url?: string;
  downloads_count: number;
  rating_average: number;
  rating_count: number;
  featured: boolean;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AppWithDetails extends App {
  developer_name: string;
  category_name: string;
  category_slug: string;
  screenshots: AppScreenshot[];
}

export interface AppScreenshot {
  id: number;
  app_id: number;
  url: string;
  caption?: string;
  sort_order: number;
  created_at: Date;
}

export interface AppReview {
  id: number;
  app_id: number;
  user_name: string;
  user_email: string;
  rating: number;
  title?: string;
  comment?: string;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_web3: boolean;
  created_at: Date;
}

export interface Developer {
  id: number;
  name: string;
  email: string;
  github_username?: string;
  website?: string;
  verified: boolean;
  created_at: Date;
}
