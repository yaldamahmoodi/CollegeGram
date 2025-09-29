# Mention List Feature Documentation

## Overview

The mention list feature allows users to retrieve all posts where they have been mentioned. This functionality enables users to see when others have tagged them in posts, creating a notification-like system for social interactions.

## API Endpoint

### GET `/api/v1/posts/mentions`

Retrieves paginated list of posts where the authenticated user has been mentioned.

#### Authentication
- **Required**: Yes
- **Method**: JWT Bearer Token

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `pageSize` | number | 10 | Number of posts per page |

#### Request Example

```bash
GET /api/v1/posts/mentions?page=1&pageSize=10
Authorization: Bearer <your_jwt_token>
```

#### Response Format

```json
{
  "code": "GET_MENTIONED_POSTS_SUCCESSFULLY",
  "totalCount": 25,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "user_id": "64a1b2c3d4e5f6789012346",
      "urls": [
        "http://localhost:3000/uploads/posts/image1.jpg",
        "http://localhost:3000/uploads/posts/image2.jpg"
      ],
      "caption": "Great post with @username mention!",
      "like_count": 10,
      "save_count": 5,
      "mentions": [
        {
          "user_id": "64a1b2c3d4e5f6789012347",
          "username": "mentioned_user"
        }
      ],
      "hashtag_array": ["#example", "#social"],
      "photo_length": 2,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "user": {
        "_id": "64a1b2c3d4e5f6789012346",
        "username": "post_author",
        "firstname": "John",
        "lastname": "Doe"
      },
      "profilePhotoUrl": "profile_photo_path.jpg"
    }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `code` | string | Response status code |
| `totalCount` | number | Total number of posts where user is mentioned |
| `data` | array | Array of post objects |
| `data[].user` | object | Post author information |
| `data[].mentions` | array | List of all users mentioned in the post |
| `data[].urls` | array | Full URLs to post images |

#### Error Responses

```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

## Implementation Details

### Database Structure

Posts with mentions are stored with an embedded structure:

```javascript
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "urls": ["image1.jpg", "image2.jpg"],
  "caption": "Post content with @username",
  "mentions": [
    {
      "user_id": ObjectId("mentioned_user_id"),
      "username": "mentioned_username"
    }
  ],
  // ... other fields
}
```

### Database Indexes

For optimal performance, the following indexes are created:

```javascript
// Compound index for mention queries with date sorting
db.posts.createIndex({ 
  "mentions.user_id": 1, 
  "createdAt": -1 
}, { 
  name: "mentions_user_id_createdAt",
  background: true 
});

// Index for count queries
db.posts.createIndex({ 
  "mentions.user_id": 1 
}, { 
  name: "mentions_user_id",
  background: true 
});
```

### Performance Considerations

1. **Indexing**: Compound indexes ensure fast queries even with large datasets
2. **Pagination**: Built-in pagination prevents memory issues with large result sets
3. **Aggregation Pipeline**: Efficient MongoDB aggregation for complex joins
4. **Background Index Creation**: Indexes created without blocking database operations

## Code Architecture

### Repository Layer (`PostRepository`)
- `getMentionedPosts()`: Handles database aggregation and pagination

### Service Layer (`PostService`)
- `getMentionedPosts()`: Business logic wrapper

### Controller Layer (`PostController`)
- `getMentionedPosts()`: HTTP request/response handling and URL formatting

### Route Configuration
- Route: `GET /mentions`
- Middleware: Authentication required
- Query parsing: Automatic pagination parameters

## Setup Instructions

### 1. Create Database Indexes

Run the index creation script:

```bash
cd apps/api
npx tsx src/scripts/createMentionIndex.ts
```

Or create manually in MongoDB:

```javascript
use your_database_name;
db.posts.createIndex({ "mentions.user_id": 1, "createdAt": -1 }, { background: true });
db.posts.createIndex({ "mentions.user_id": 1 }, { background: true });
```

### 2. Verify Installation

Test the endpoint:

```bash
curl -X GET "http://localhost:3000/api/v1/posts/mentions?page=1&pageSize=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Usage Examples

### Frontend Integration

```javascript
// Fetch mentioned posts
const fetchMentionedPosts = async (page = 1, pageSize = 10) => {
  const response = await fetch(
    `/api/v1/posts/mentions?page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  return data;
};

// Usage
fetchMentionedPosts(1, 10)
  .then(result => {
    console.log(`Found ${result.totalCount} mentions`);
    console.log(result.data); // Array of posts
  });
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

const useMentionedPosts = (page = 1, pageSize = 10) => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const result = await fetchMentionedPosts(page, pageSize);
        setPosts(result.data);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('Error fetching mentioned posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, pageSize]);

  return { posts, totalCount, loading };
};
```

## Testing

### Manual Testing

1. Create posts with mentions
2. Verify mentioned users can retrieve posts via the endpoint
3. Test pagination with large datasets
4. Verify proper authentication handling

### Database Query Testing

```javascript
// Test the aggregation pipeline directly
db.posts.aggregate([
  { $match: { "mentions.user_id": ObjectId("user_id_here") } },
  { $sort: { createdAt: -1 } },
  { $limit: 10 }
]);

// Test index usage
db.posts.find({ "mentions.user_id": ObjectId("user_id_here") }).explain("executionStats");
```

## Troubleshooting

### Common Issues

1. **Slow Queries**: Ensure indexes are created properly
2. **Authentication Errors**: Verify JWT token is valid
3. **Empty Results**: Check if user has been mentioned in any posts
4. **Pagination Issues**: Verify page and pageSize parameters

### Debug Queries

```javascript
// Check if indexes exist
db.posts.getIndexes();

// Count mentions for a user
db.posts.countDocuments({ "mentions.user_id": ObjectId("user_id_here") });

// Verify mention structure
db.posts.findOne({ "mentions.user_id": { $exists: true } });
```

## Future Enhancements

1. **Real-time Notifications**: WebSocket integration for instant mention alerts
2. **Mention Filtering**: Filter by post type, date range, or author
3. **Read/Unread Status**: Track which mentions have been viewed
4. **Mention Analytics**: Statistics on mention frequency and engagement
5. **Bulk Operations**: Mark multiple mentions as read/unread
