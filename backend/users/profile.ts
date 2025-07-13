import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { usersDB } from "./db";
import { authDB } from "../auth/db";

interface GetProfileRequest {
  user_id?: number;
  authorization?: Header<"Authorization">;
}

interface UpdateProfileRequest {
  authorization: Header<"Authorization">;
  bio?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  github_handle?: string;
  public_profile?: boolean;
  show_email?: boolean;
  show_downloads?: boolean;
  show_reviews?: boolean;
}

interface UserProfile {
  user_id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  github_handle?: string;
  public_profile: boolean;
  show_email: boolean;
  show_downloads: boolean;
  show_reviews: boolean;
  join_date: Date;
  total_downloads: number;
  total_reviews: number;
  average_rating_given: number;
}

interface ProfileResponse {
  profile: UserProfile;
}

// Gets a user's profile information.
export const getProfile = api<GetProfileRequest, ProfileResponse>(
  { expose: true, method: "GET", path: "/users/profile" },
  async ({ user_id, authorization }) => {
    let requestingUserId: number | null = null;
    
    // Get requesting user if authenticated
    if (authorization) {
      const token = authorization.replace("Bearer ", "");
      const userSession = await authDB.queryRow<{ user_id: number }>`
        SELECT user_id FROM user_sessions 
        WHERE token = ${token} AND expires_at > NOW()
      `;
      if (userSession) {
        requestingUserId = userSession.user_id;
      }
    }

    // If no user_id specified, return requesting user's profile
    const targetUserId = user_id || requestingUserId;
    if (!targetUserId) {
      throw APIError.invalidArgument("user_id required or must be authenticated");
    }

    // Get user basic info
    const user = await authDB.queryRow<{
      id: number;
      username: string;
      first_name?: string;
      last_name?: string;
      email: string;
      avatar_url?: string;
      created_at: Date;
    }>`
      SELECT id, username, first_name, last_name, email, avatar_url, created_at
      FROM users WHERE id = ${targetUserId}
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    // Get profile data
    let profile = await usersDB.queryRow<{
      bio?: string;
      location?: string;
      website?: string;
      twitter_handle?: string;
      github_handle?: string;
      public_profile: boolean;
      show_email: boolean;
      show_downloads: boolean;
      show_reviews: boolean;
    }>`
      SELECT bio, location, website, twitter_handle, github_handle, 
             public_profile, show_email, show_downloads, show_reviews
      FROM user_profiles WHERE user_id = ${targetUserId}
    `;

    // Create default profile if doesn't exist
    if (!profile) {
      await usersDB.exec`
        INSERT INTO user_profiles (user_id) VALUES (${targetUserId})
      `;
      profile = {
        public_profile: true,
        show_email: false,
        show_downloads: true,
        show_reviews: true
      };
    }

    // Check if profile is public or if requesting own profile
    const isOwnProfile = requestingUserId === targetUserId;
    if (!profile.public_profile && !isOwnProfile) {
      throw APIError.permissionDenied("profile is private");
    }

    // Get user statistics
    const downloadStats = await authDB.queryRow<{ total: number }>`
      SELECT COUNT(*) as total FROM user_downloads WHERE user_id = ${targetUserId}
    `;

    const reviewStats = await authDB.queryRow<{ total: number; avg_rating: number }>`
      SELECT COUNT(*) as total, AVG(rating) as avg_rating 
      FROM app_reviews ar
      JOIN users u ON ar.user_email = u.email
      WHERE u.id = ${targetUserId}
    `;

    return {
      profile: {
        user_id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: (profile.show_email || isOwnProfile) ? user.email : undefined,
        avatar_url: user.avatar_url,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        twitter_handle: profile.twitter_handle,
        github_handle: profile.github_handle,
        public_profile: profile.public_profile,
        show_email: profile.show_email,
        show_downloads: profile.show_downloads,
        show_reviews: profile.show_reviews,
        join_date: user.created_at,
        total_downloads: downloadStats?.total || 0,
        total_reviews: reviewStats?.total || 0,
        average_rating_given: reviewStats?.avg_rating || 0
      }
    };
  }
);

// Updates the current user's profile.
export const updateProfile = api<UpdateProfileRequest, ProfileResponse>(
  { expose: true, method: "PUT", path: "/users/profile" },
  async ({ authorization, ...updates }) => {
    const token = authorization.replace("Bearer ", "");
    const userSession = await authDB.queryRow<{ user_id: number }>`
      SELECT user_id FROM user_sessions 
      WHERE token = ${token} AND expires_at > NOW()
    `;

    if (!userSession) {
      throw APIError.unauthenticated("invalid or expired session");
    }

    // Update profile
    await usersDB.exec`
      INSERT INTO user_profiles (
        user_id, bio, location, website, twitter_handle, github_handle,
        public_profile, show_email, show_downloads, show_reviews, updated_at
      ) VALUES (
        ${userSession.user_id}, ${updates.bio}, ${updates.location}, ${updates.website},
        ${updates.twitter_handle}, ${updates.github_handle}, ${updates.public_profile},
        ${updates.show_email}, ${updates.show_downloads}, ${updates.show_reviews}, NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        bio = EXCLUDED.bio,
        location = EXCLUDED.location,
        website = EXCLUDED.website,
        twitter_handle = EXCLUDED.twitter_handle,
        github_handle = EXCLUDED.github_handle,
        public_profile = EXCLUDED.public_profile,
        show_email = EXCLUDED.show_email,
        show_downloads = EXCLUDED.show_downloads,
        show_reviews = EXCLUDED.show_reviews,
        updated_at = NOW()
    `;

    // Return updated profile
    return getProfile({ user_id: userSession.user_id, authorization });
  }
);
