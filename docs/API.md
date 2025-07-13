# Web3Store API Documentation

This document provides comprehensive documentation for the Web3Store API. The API is built using Encore.ts and provides type-safe endpoints for all platform functionality.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Apps API](#apps-api)
4. [Auth API](#auth-api)
5. [Users API](#users-api)
6. [Developer API](#developer-api)
7. [Legal API](#legal-api)
8. [Contact API](#contact-api)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)
11. [SDKs and Libraries](#sdks-and-libraries)

## Overview

### Base URL
```
Production: https://api.web3store.com
Development: http://localhost:4000
```

### API Version
Current API version: `v1`

### Content Type
All API requests and responses use `application/json` content type.

### Response Format
All API responses follow a consistent format:

```json
{
  "data": {},
  "error": null,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Authentication

### Overview
Web3Store uses JWT (JSON Web Tokens) for authentication. Tokens are obtained through the login endpoint and must be included in the `Authorization` header for protected endpoints.

### Authentication Header
```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle
- **Expiration**: Tokens expire after 30 days
- **Refresh**: Automatic refresh on API calls
- **Revocation**: Tokens can be revoked via logout

## Apps API

### List Apps
Retrieve a paginated list of apps with filtering and sorting options.

```http
GET /apps
```

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `category` | string | Filter by category slug | - |
| `search` | string | Search query | - |
| `web3_only` | boolean | Filter Web3 apps only | false |
| `featured` | boolean | Filter featured apps only | false |
| `sort` | string | Sort order: `popular`, `rating`, `newest` | `newest` |
| `limit` | number | Number of apps per page (max 100) | 20 |
| `offset` | number | Number of apps to skip | 0 |

#### Response
```json
{
  "apps": [
    {
      "id": 1,
      "name": "DeFi Wallet",
      "slug": "defi-wallet",
      "description": "Secure DeFi wallet for Ethereum",
      "short_description": "Secure DeFi wallet",
      "developer_id": 1,
      "developer_name": "Web3 Labs",
      "category_id": 1,
      "category_name": "Wallets",
      "category_slug": "wallets",
      "icon_url": "https://example.com/icon.png",
      "banner_url": "https://example.com/banner.png",
      "version": "1.0.0",
      "apk_url": "https://example.com/app.apk",
      "apk_size": 15728640,
      "package_name": "com.web3labs.defiwallet",
      "min_android_version": "7.0",
      "target_android_version": "13.0",
      "permissions": ["INTERNET", "CAMERA"],
      "is_web3": true,
      "blockchain_networks": ["Ethereum", "Polygon"],
      "wallet_required": true,
      "smart_contract_verified": true,
      "github_repo": "https://github.com/web3labs/defi-wallet",
      "website_url": "https://defiwallet.com",
      "downloads_count": 10000,
      "rating_average": 4.5,
      "rating_count": 200,
      "featured": true,
      "published": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "screenshots": [
        {
          "id": 1,
          "app_id": 1,
          "url": "https://example.com/screenshot1.png",
          "caption": "Main interface",
          "sort_order": 0,
          "created_at": "2024-01-01T00:00:00Z"
        }
      ]
    }
  ],
  "total": 100,
  "has_more": true
}
```

### Get App
Retrieve detailed information about a specific app.

```http
GET /apps/{slug}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | App slug identifier |

#### Response
Returns a single app object with the same structure as in the list response.

### Get Featured Apps
Retrieve featured, trending, and new apps for the homepage.

```http
GET /apps/featured
```

#### Response
```json
{
  "featured_apps": [...],
  "trending_apps": [...],
  "new_apps": [...]
}
```

### Download App
Initiate an app download and track the download event.

```http
POST /apps/{slug}/download
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | User authentication token |
| `User-Agent` | No | Client user agent |
| `X-Forwarded-For` | No | Client IP address |

#### Response
```json
{
  "download_url": "https://example.com/app.apk",
  "filename": "DeFi_Wallet_v1.0.0.apk",
  "size": 15728640
}
```

### List Categories
Retrieve all app categories.

```http
GET /categories
```

#### Response
```json
{
  "categories": [
    {
      "id": 1,
      "name": "DeFi",
      "slug": "defi",
      "description": "Decentralized Finance applications",
      "icon": "💰",
      "is_web3": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### List Reviews
Retrieve reviews for a specific app.

```http
GET /apps/{slug}/reviews
```

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | number | Number of reviews per page | 10 |
| `offset` | number | Number of reviews to skip | 0 |

#### Response
```json
{
  "reviews": [
    {
      "id": 1,
      "app_id": 1,
      "user_name": "john_doe",
      "user_email": "john@example.com",
      "rating": 5,
      "title": "Great app!",
      "comment": "This app is amazing and works perfectly.",
      "helpful_count": 10,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "has_more": true
}
```

### Create Review
Submit a review for an app.

```http
POST /apps/{slug}/reviews
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Request Body
```json
{
  "rating": 5,
  "title": "Great app!",
  "comment": "This app is amazing and works perfectly."
}
```

#### Response
```json
{
  "id": 1,
  "message": "review created successfully"
}
```

## Auth API

### Sign Up
Create a new user account.

```http
POST /auth/signup
```

#### Request Body
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Response
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2024-02-01T00:00:00Z"
}
```

### Sign In
Authenticate a user and create a session.

```http
POST /auth/login
```

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Response
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "is_developer": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2024-02-01T00:00:00Z"
}
```

### Get Current User
Retrieve the current user's profile information.

```http
GET /auth/me
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Response
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "email_verified": true,
    "is_developer": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Sign Out
Log out a user by invalidating their session.

```http
POST /auth/logout
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Response
```json
{
  "message": "logged out successfully"
}
```

### Get User Downloads
Retrieve the current user's download history.

```http
GET /auth/downloads
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Response
```json
{
  "apps": [
    {
      "id": 1,
      "name": "DeFi Wallet",
      "slug": "defi-wallet",
      "icon_url": "https://example.com/icon.png",
      "developer_name": "Web3 Labs",
      "category_name": "Wallets",
      "version": "1.0.0",
      "downloaded_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Wishlist
Retrieve the current user's wishlist.

```http
GET /auth/wishlist
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Response
```json
{
  "apps": [
    {
      "id": 1,
      "name": "DeFi Wallet",
      "slug": "defi-wallet",
      "icon_url": "https://example.com/icon.png",
      "developer_name": "Web3 Labs",
      "category_name": "Wallets",
      "rating_average": 4.5,
      "downloads_count": 10000,
      "added_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Add to Wishlist
Add an app to the user's wishlist.

```http
POST /auth/wishlist/{app_id}
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `app_id` | number | App ID to add to wishlist |

#### Response
```json
{
  "message": "app added to wishlist"
}
```

### Remove from Wishlist
Remove an app from the user's wishlist.

```http
DELETE /auth/wishlist/{app_id}
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `app_id` | number | App ID to remove from wishlist |

#### Response
```json
{
  "message": "app removed from wishlist"
}
```

## Users API

### Get User Profile
Retrieve a user's profile information.

```http
GET /users/profile
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | number | User ID (optional, defaults to current user) |

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Response
```json
{
  "profile": {
    "user_id": 1,
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Web3 enthusiast and developer",
    "location": "San Francisco, CA",
    "website": "https://johndoe.com",
    "twitter_handle": "johndoe",
    "github_handle": "johndoe",
    "public_profile": true,
    "show_email": false,
    "show_downloads": true,
    "show_reviews": true,
    "join_date": "2024-01-01T00:00:00Z",
    "total_downloads": 25,
    "total_reviews": 10,
    "average_rating_given": 4.2
  }
}
```

### Update User Profile
Update the current user's profile information.

```http
PUT /users/profile
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Request Body
```json
{
  "bio": "Web3 enthusiast and developer",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com",
  "twitter_handle": "johndoe",
  "github_handle": "johndoe",
  "public_profile": true,
  "show_email": false,
  "show_downloads": true,
  "show_reviews": true
}
```

#### Response
Returns the updated profile object.

### Get User Settings
Retrieve the current user's settings.

```http
GET /users/settings
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Response
```json
{
  "settings": {
    "email_notifications": true,
    "push_notifications": true,
    "marketing_emails": false,
    "theme_preference": "system",
    "language": "en",
    "timezone": "UTC",
    "accessibility_high_contrast": false,
    "accessibility_large_text": false
  }
}
```

### Update User Settings
Update the current user's settings.

```http
PUT /users/settings
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | User authentication token |

#### Request Body
```json
{
  "email_notifications": true,
  "push_notifications": false,
  "theme_preference": "dark",
  "language": "en"
}
```

#### Response
Returns the updated settings object.

## Developer API

### Get Developer Dashboard
Retrieve developer dashboard data including stats and analytics.

```http
GET /developer/dashboard
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Developer authentication token |

#### Response
```json
{
  "stats": {
    "total_apps": 5,
    "total_downloads": 50000,
    "total_revenue": 1250.00,
    "average_rating": 4.3,
    "pending_reviews": 2,
    "monthly_downloads": 5000,
    "monthly_revenue": 125.00
  },
  "recent_apps": [
    {
      "id": 1,
      "name": "DeFi Wallet",
      "slug": "defi-wallet",
      "version": "1.0.0",
      "status": "published",
      "downloads_count": 10000,
      "rating_average": 4.5,
      "rating_count": 200,
      "last_updated": "2024-01-01T00:00:00Z"
    }
  ],
  "analytics_data": [
    {
      "date": "2024-01-01",
      "downloads": 100,
      "revenue": 25.00
    }
  ]
}
```

### Submit App
Submit a new app for review.

```http
POST /developer/submit
```

#### Headers
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Developer authentication token |

#### Request Body
```json
{
  "name": "DeFi Wallet",
  "description": "Secure DeFi wallet for Ethereum and other networks",
  "short_description": "Secure DeFi wallet",
  "category_id": 1,
  "icon_url": "https://example.com/icon.png",
  "banner_url": "https://example.com/banner.png",
  "screenshots": [
    "https://example.com/screenshot1.png",
    "https://example.com/screenshot2.png"
  ],
  "version": "1.0.0",
  "apk_url": "https://example.com/app.apk",
  "apk_size": 15728640,
  "package_name": "com.example.defiwallet",
  "min_android_version": "7.0",
  "target_android_version": "13.0",
  "permissions": ["INTERNET", "CAMERA"],
  "is_web3": true,
  "blockchain_networks": ["Ethereum", "Polygon"],
  "wallet_required": true,
  "github_repo": "https://github.com/example/defi-wallet",
  "website_url": "https://defiwallet.com"
}
```

#### Response
```json
{
  "submission_id": 123,
  "message": "app submitted for review"
}
```

## Legal API

### List Legal Documents
Retrieve all active legal documents.

```http
GET /legal
```

#### Response
```json
{
  "documents": [
    {
      "id": 1,
      "document_type": "terms_of_service",
      "title": "Terms of Service",
      "content": "# Terms of Service\n\n...",
      "version": "1.0",
      "effective_date": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Legal Document
Retrieve a specific legal document by type.

```http
GET /legal/{document_type}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `document_type` | string | Document type: `terms_of_service`, `privacy_policy`, `community_guidelines` |

#### Response
```json
{
  "document": {
    "id": 1,
    "document_type": "terms_of_service",
    "title": "Terms of Service",
    "content": "# Terms of Service\n\n...",
    "version": "1.0",
    "effective_date": "2024-01-01T00:00:00Z"
  }
}
```

## Contact API

### Send Contact Message
Send a contact message to the support team.

```http
POST /contact
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about app submission",
  "message": "I have a question about the app submission process..."
}
```

#### Response
```json
{
  "message": "Your message has been sent successfully. We will get back to you shortly."
}
```

## Error Handling

### Error Response Format
All API errors follow a consistent format:

```json
{
  "code": "error_code",
  "message": "Human-readable error message",
  "details": {
    "field": "Additional error details"
  }
}
```

### HTTP Status Codes
| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Error Codes
| Error Code | Description |
|------------|-------------|
| `invalid_argument` | Invalid request parameters |
| `unauthenticated` | Authentication required |
| `permission_denied` | Insufficient permissions |
| `not_found` | Resource not found |
| `already_exists` | Resource already exists |
| `resource_exhausted` | Rate limit exceeded |
| `internal` | Internal server error |

### Example Error Response
```json
{
  "code": "invalid_argument",
  "message": "Invalid email format",
  "details": {
    "field": "email",
    "value": "invalid-email"
  }
}
```

## Rate Limiting

### Rate Limits
| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 10 requests | 1 minute |
| App Downloads | 100 requests | 1 hour |
| API Calls (General) | 1000 requests | 1 hour |
| Search | 100 requests | 1 minute |

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response
```json
{
  "code": "resource_exhausted",
  "message": "Rate limit exceeded",
  "details": {
    "retry_after": "60s"
  }
}
```

## SDKs and Libraries

### Official SDKs
- **JavaScript/TypeScript**: `@web3store/sdk`
- **React**: `@web3store/react`
- **React Native**: `@web3store/react-native`

### Installation
```bash
npm install @web3store/sdk
```

### Usage Example
```typescript
import { Web3StoreClient } from '@web3store/sdk';

const client = new Web3StoreClient({
  baseUrl: 'https://api.web3store.com',
  apiKey: 'your-api-key'
});

// List apps
const apps = await client.apps.list({
  category: 'defi',
  limit: 10
});

// Get app details
const app = await client.apps.get('defi-wallet');

// Authenticate user
const auth = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});
```

### React Hook Example
```typescript
import { useApps, useAuth } from '@web3store/react';

function AppList() {
  const { data: apps, loading } = useApps({
    category: 'defi'
  });
  
  const { user, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {apps.map(app => (
        <div key={app.id}>{app.name}</div>
      ))}
    </div>
  );
}
```

---

For more information or support, contact our developer team at [developer-support@web3store.com](mailto:developer-support@web3store.com).
