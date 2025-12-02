# Post Creation & Media Storage Implementation Guide

## What Was Implemented

### Backend (Node.js/Express)

#### 1. **Cloudinary Utility** (`src/utils/cloudinary.utils.ts`)
- Initializes Cloudinary with environment variables
- `uploadFileToCloudinary()` - Streams files directly to Cloudinary
- `deleteFileFromCloudinary()` - Removes files from Cloudinary
- `extractPublicIdFromUrl()` - Extracts ID from URL for deletion

#### 2. **Multer Middleware** (`src/utils/multer.utils.ts`)
- Memory storage configuration (no temp files on disk)
- File type validation (JPEG, PNG, GIF, WebP only)
- File size limit: 5MB max
- Exports `uploadSingleFile` and `uploadMultipleFiles` middleware

#### 3. **Upload Endpoint** (`src/apis/upload/`)
- **Route**: POST `/apis/upload`
  - Accepts multipart/form-data with file
  - Returns: `{ url: "cloudinary-secure-url" }`
  - Authentication required (isLoggedInController)

- **Route**: POST `/apis/upload/multiple`
  - Accepts multiple files
  - Returns: `{ urls: ["url1", "url2", ...] }`

#### 4. **Post Controller Enhancement** (`src/apis/post/post.controller.ts`)
- **Updated `postPostController()`**: Now accepts `mediaUrls` array
  - Creates post first
  - Then creates media records for each URL (cascading insertion)
  - Error handling per media (one failure doesn't stop others)

- **Enhanced `deletePostController()`**: Cascading delete
  - Fetches all media for post
  - Deletes all media records first
  - Then deletes post

### Frontend (React/Remix)

#### 1. **Post Creation Form Component** (`app/components/post-creation-form.tsx`)
- Wanderlist selection dropdown (dynamic from backend)
- Title & description fields
- Multiple photo upload via Cloudinary
- Visibility controls (public/private/friends)
- Photo preview and removal
- Success/error messaging

#### 2. **Community Page Integration** (`app/routes/community/community.tsx`)
- **Loader function** - Fetches auth + all visible posts + media
  ```
  GET /apis/post/visible/posts -> returns posts
  GET /apis/media/post/{postId} -> returns media for each post
  ```
- Real post feed display with photos
- Fallback to demo data if no posts exist
- Shows post title, content, date, and all photos

## Testing Workflow

### Prerequisites
1. Create a test account in the app (if not already)
2. Create at least one Wanderlist in your profile
3. Ensure backend is running on port 4200
4. Ensure frontend is running on local dev server

### Step 1: Test Post Creation Form
1. Navigate to **Community** page
2. Scroll down to "Create a New Post" section
3. Fill out form:
   - Select a Wanderlist
   - Enter Title: "My Test Post"
   - Enter Description: "Testing real data with photos"
   - Click "Add Photos" and upload 1-3 images from your device
   - Select Visibility: "public"
4. Click "Create Post"
5. Should see success message
6. Form should clear

### Step 2: Verify Backend Media Storage
Check that:
1. Photos were uploaded to Cloudinary (check Cloudinary dashboard)
2. Media records created in database
   ```
   SELECT * FROM media WHERE post_id = '{your-post-id}';
   ```
3. Post created in database
   ```
   SELECT * FROM post WHERE id = '{post-id}';
   ```

### Step 3: Test Post Feed Display
1. Navigate to **Community** page
2. Scroll to "MAIN GRID LAYOUT" section (post feed)
3. Your newly created post should appear:
   - Title displayed
   - Content displayed
   - Photos displayed in grid (1-2 columns depending on screen)
   - Creation date shown
   - Like/comment counts (0 initially)

### Step 4: Create Additional Posts
Test with multiple posts:
1. Create 3-5 posts with varying:
   - Number of photos (1, 2, 3+)
   - Length of content
   - Visibility settings
2. Verify all appear in feed correctly

### Step 5: Test with Team Data
Once confident with testing:
1. Have other team members create posts
2. Verify you see their posts in your feed
3. Test cross-browser display
4. Check mobile responsiveness

## API Endpoints Summary

### Post Endpoints
- `POST /apis/post/` - Create post (accepts `mediaUrls` array)
- `GET /apis/post/visible/posts` - Get all public posts
- `PUT /apis/post/` - Update post
- `DELETE /apis/post/:id` - Delete post (cascades to media)

### Upload Endpoints
- `POST /apis/upload` - Upload single file → returns `{ url }`
- `POST /apis/upload/multiple` - Upload multiple files → returns `{ urls }`

### Media Endpoints
- `POST /apis/media/` - Create media record
- `GET /apis/media/post/:postId` - Get all media for post
- `DELETE /apis/media/:id` - Delete media record

## Frontend Request Payload

When frontend creates a post:
```json
{
  "id": "uuid-v7",
  "wanderlistId": "uuid-v7",
  "title": "Post Title",
  "content": "Post description...",
  "visibility": "public",
  "mediaUrls": [
    "https://res.cloudinary.com/.../image/upload/.../filename.jpg",
    "https://res.cloudinary.com/.../image/upload/.../photo2.jpg"
  ]
}
```

## Environment Variables Needed

### Backend `.env`
```
CLOUDINARY_CLOUD_NAME=dgkckqptm
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
REDIS_HOST=your-redis-host
SESSION_SECRET=your-session-secret
```

### Frontend `.env.development`
```
REST_API_URL=http://eric.ddfullstack.cloud:8080/apis
VITE_CLOUDINARY_CLOUD_NAME=dgkckqptm
```

## Troubleshooting

### Issue: "No file provided" error
- Frontend is not sending multipart/form-data
- Check that file input has `accept="image/*"`

### Issue: "File must be an image" error
- Trying to upload non-image file
- Frontend validation should prevent this
- Check MIME type detection

### Issue: Post created but no photos appear
- Photos uploaded successfully but media records not inserted
- Check if post ID is correct
- Verify media URLs are valid

### Issue: Posts don't appear in feed
- Check if posts have `visibility: 'public'`
- Verify API response includes posts
- Check browser console for fetch errors

### Issue: Photo upload fails with CORS error
- Frontend sending to wrong URL
- Check that Cloudinary upload URL is correct
- Verify unsigned upload preset exists in Cloudinary

## Next Steps

1. **Image Optimization**: Add image resizing/compression before upload
2. **Comments**: Wire backend comment API to frontend
3. **Likes**: Implement like/unlike functionality
4. **Photo Library**: Save uploaded photos for reuse
5. **Album Publishing**: Convert albums to public posts
6. **Moodboard**: Create themed photo collages

## Team Coordination

Make sure team knows:
- Backend upload endpoint is ready at `/apis/upload`
- Post creation accepts `mediaUrls` array
- Media cascades delete when post is deleted
- All uploads go to `wanderlist-scrapbook-v1` folder in Cloudinary
- Database uses UUID v7 for all IDs
