# Role-Based Access Control (RBAC) Documentation

## Overview

The RBAC system enforces permissions for all protected actions in the application. It ensures that only users with the appropriate roles can perform specific actions.

## Roles

### Admin (`admin`)
Full access to all features including:
- All post operations (create, read, update, delete, bulk operations)
- All comment operations
- User management (read, update, delete)
- Wellness tracking
- Admin-only features

### Editor (`editor`)
Can manage content:
- Post operations (create, read, update, delete, bulk operations)
- Comment operations (create, read, update, delete)
- Own wellness tracking
- **Cannot** manage users or access admin features

### Reader (`reader`)
Can manage their own content:
- Create posts (own posts)
- Read posts
- Update posts (own posts only)
- Delete posts (own posts only)
- Create comments
- Update/delete own comments
- Own wellness tracking
- **Cannot** bulk update/delete or manage other users' posts

## Permissions

### Post Permissions
- `posts:create` - Create new blog posts
- `posts:read` - View blog posts
- `posts:update` - Update existing posts
- `posts:delete` - Delete posts
- `posts:bulk-update` - Update multiple posts at once
- `posts:bulk-delete` - Delete multiple posts at once

### Comment Permissions
- `comments:create` - Create new comments
- `comments:read` - View comments
- `comments:update` - Update existing comments
- `comments:delete` - Delete comments

### User Permissions (Admin Only)
- `users:read` - View user information
- `users:update` - Update user information
- `users:delete` - Delete users

### Wellness Permissions
- `wellness:read` - View wellness check-ins (own only, unless admin)
- `wellness:create` - Create wellness check-ins

### Admin Permissions
- `admin:access` - Access admin-only features

## Permission Matrix

| Permission | Admin | Editor | Reader |
|------------|-------|--------|--------|
| `posts:create` | ✅ | ✅ | ✅ |
| `posts:read` | ✅ | ✅ | ✅ |
| `posts:update` | ✅ | ✅ | ✅* |
| `posts:delete` | ✅ | ✅ | ✅* |
| `posts:bulk-update` | ✅ | ✅ | ❌ |
| `posts:bulk-delete` | ✅ | ✅ | ❌ |
| `comments:create` | ✅ | ✅ | ✅ |
| `comments:read` | ✅ | ✅ | ✅ |
| `comments:update` | ✅ | ✅ | ✅* |
| `comments:delete` | ✅ | ✅ | ✅* |
| `users:read` | ✅ | ❌ | ❌ |
| `users:update` | ✅ | ❌ | ❌ |
| `users:delete` | ✅ | ❌ | ❌ |
| `wellness:read` | ✅ | ✅* | ✅* |
| `wellness:create` | ✅ | ✅ | ✅ |
| `admin:access` | ✅ | ❌ | ❌ |

*Own resources only (enforced by ownership checks in addition to permissions)

## Usage in API Routes

### Basic Authentication

```typescript
import { requireAuth } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof NextResponse) {
    return authResult; // Returns 401 if unauthorized
  }
  
  // User is authenticated
  const user = authResult;
  // ... your code
}
```

### Permission-Based Authorization

```typescript
import { requirePermission } from "@/lib/rbac";

export async function DELETE(request: NextRequest) {
  const authResult = await requirePermission(request, "posts:delete");
  
  if (authResult instanceof NextResponse) {
    return authResult; // Returns 401 or 403
  }
  
  // User is authenticated AND has permission
  const user = authResult;
  // ... your code
}
```

### Ownership-Based Authorization

```typescript
import { requirePermission, canModifyOwnResource } from "@/lib/rbac";

export async function PATCH(request: NextRequest, { params }) {
  // First check if user can update posts
  const authResult = await requirePermission(request, "posts:update");
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  const user = authResult;
  
  // Get the post
  const post = await prisma.post.findUnique({
    where: { id: params.id }
  });
  
  // Check ownership (admins can update any post)
  if (!canModifyOwnResource(user.role, post.authorId, user.id)) {
    return NextResponse.json(
      { error: "Forbidden - You can only update your own posts" },
      { status: 403 }
    );
  }
  
  // User is authorized to update this specific post
  // ... your code
}
```

## Token Authentication

The RBAC system supports two authentication methods:

1. **Authorization Header** (Bearer token):
   ```
   Authorization: Bearer <jwt-token>
   ```

2. **Cookie** (fallback):
   ```
   Cookie: token=<jwt-token>
   ```

## Error Responses

### 401 Unauthorized
Returned when:
- No token provided
- Invalid token
- Expired token
- Invalid role in token

### 403 Forbidden
Returned when:
- User is authenticated but doesn't have required permission
- User tries to modify a resource they don't own (and isn't admin)

## Testing

All RBAC functions should be tested to ensure:
- ✅ Correct roles have correct permissions
- ✅ Unauthorized users are blocked
- ✅ Users without permissions get 403
- ✅ Admins can access all features
- ✅ Ownership checks work correctly

## Files

- `lib/rbac.ts` - TypeScript RBAC implementation
- `lib/rbac.js` - JavaScript RBAC implementation
- Both implementations are identical and can be used interchangeably
