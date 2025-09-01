## API Conventions

### API Routes Structure
- All API endpoints are prefixed with `/api`
- Version 1 endpoints are prefixed with `/api/v1`
- Health check endpoint is available at `/api/health`
- Authentication endpoints are at `/api/v1/auth/*`
- User endpoints are at `/api/v1/users/*`

### API Naming Conventions
- Use nouns for resources (e.g., users, posts)
- Use kebab-case for multi-word paths (e.g., `/profile-photos`)
- Use plural for collection endpoints (e.g., `/users`)
- Use HTTP methods appropriately:
  - GET: Retrieve resources
  - POST: Create resources
  - PATCH: Partially update resources
  - PUT: Replace resources
  - DELETE: Remove resources

### API Endpoints Input Documentation

#### Authentication Endpoints

##### POST /api/v1/auth/register
- **Description**: Register a new user
- **Request Body**:
  - `email` (string, required): Valid email format, max 255 characters
  - `username` (string, required): Min 1 character, max 255 characters
  - `password` (string, required): Min 6 characters, max 255 characters
  - `firstname` (string, optional): Max 255 characters
  - `lastname` (string, optional): Max 255 characters
  - `biography` (string, optional): Max 1500 characters
- **Example**:
```json
{
  "email": "user@example.com",
  "username": "newuser",
  "password": "securepassword",
  "firstname": "John",
  "lastname": "Doe",
  "biography": "This is my bio"
}
```

##### POST /api/v1/auth/login
- **Description**: Authenticate a user and get access token
- **Request Body**:
  - `username` (string, required): User's username
  - `password` (string, required): User's password
- **Example**:
```json
{
  "username": "existinguser",
  "password": "correctpassword"
}
```

#### User Endpoints

##### POST /api/v1/users/profile/upload
- **Description**: Upload a profile photo
- **Authentication**: Required
- **Request Body**:
  - `profile` (file, required): Image file to upload as profile photo
- **Example**: Multipart form data with a file field named "profile"

##### GET /api/v1/users/profile
- **Description**: Get user profile details
- **Authentication**: Required
- **Request Body**: None

##### GET /api/v1/users/profile/posts
- **Description**: Get posts created by the authenticated user
- **Authentication**: Required
- **Request Body**: None

##### POST /api/v1/users/upload/post
- **Description**: Create a new post with photos
- **Authentication**: Required
- **Request Body**:
  - `photos` (files, required): Up to 10 image files
  - `caption` (string, optional): Post caption, max 500 characters
- **Example**: Multipart form data with file field named "photos" and text field "caption"

##### PATCH /api/v1/users/profile/update
- **Description**: Update user profile information
- **Authentication**: Required
- **Request Body**: Same fields as register endpoint, all fields optional
  - `email` (string, optional): Valid email format, max 255 characters
  - `username` (string, optional): Min 1 character, max 255 characters
  - `password` (string, optional): Min 6 characters, max 255 characters
  - `firstname` (string, optional): Max 255 characters
  - `lastname` (string, optional): Max 255 characters
  - `biography` (string, optional): Max 1500 characters
- **Example**:
```json
{
  "firstname": "Updated",
  "lastname": "Name",
  "biography": "My updated bio"
}
```

### Database Conventions
- Use underscore before ID references (e.g., `user_id`)
- Use camelCase for field names
- Use `createdAt` and `updatedAt` without underscores



## Output and Response Conventions
### API Response Format

All API responses follow a consistent JSON structure.  
Responses are divided into **error** and **success** categories.

---

### Error Response

- **Status Code**: Standard [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
- **code**: Machine-readable identifier of the error.
- **detail** *(optional)*: Human-readable explanation of the error.

### Example
```json
{
  "code": "INVALID_CREDENTIALS",
  "detail": "username format is invalid"
}
```

---

### Success Response

- **Status Code**: Standard HTTP status codes (e.g., `200`, `201`).
- **code**: Machine-readable identifier of the success.
- **message**: Human-readable confirmation message.
- **data** *(optional)*: Object containing the result payload (may vary depending on endpoint).

### Example

```json
{
  "code": "REGISTER_SUCCESS",
  "message": "User registered successfully",
  "data": {
    "id": "12345",
    "email": "user@example.com"
  }
}
```

---

### Notes
- `code` in error responses should always be **short, descriptive, and predictable** (e.g., `NOT_FOUND`, `UNAUTHORIZED`, `INVALID_INPUT`).
- `data` is only included on success responses when there is relevant business data to return.
- Clients should **always rely on both HTTP status code and response structure** for correct handling.
- Authentication uses HTTP-only cookies for secure token storage.

