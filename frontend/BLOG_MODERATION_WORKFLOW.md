# Blog Moderation Workflow Implementation

## Overview
Implemented a moderation workflow for blog posts where all submitted blogs go through a moderator approval process before being published.

## Changes Made

### 1. Blog Status Flow

**Old Flow:**
```
Draft → Published (directly)
```

**New Flow:**
```
Draft → Pending Approval → Approved/Rejected
                         ↓
                    (Moderator Decision)
```

### 2. Status Types

Updated type definitions to include moderation statuses:

**blogService.ts:**
```typescript
export interface Blog {
    // ... other fields
    status: 'draft' | 'published' | 'archived' | 'pending' | 'approved' | 'rejected';
}

export interface CreateBlogRequest {
    // ... other fields
    status?: 'draft' | 'published' | 'pending';
}

export interface UpdateBlogRequest {
    // ... other fields
    status?: 'draft' | 'published' | 'pending' | 'approved' | 'rejected';
}
```

**myblogs.tsx:**
```typescript
type Blog = {
    // ... other fields
    status: 'draft' | 'published' | 'archived' | 'pending' | 'approved' | 'rejected';
}
```

### 3. Blog Submission Changes

#### Create Draft (Save as Draft)
- **Status:** `draft`
- **Message:** "Blog submitted for moderator approval!"
- **Behavior:** Saved locally, not sent for approval

#### Publish Blog
- **Status:** `pending` (changed from `published`)
- **Message:** "Blog submitted for moderator approval!"
- **Behavior:** Sent to moderators for review

#### Update Blog (Publish)
- **Status:** `pending` (when clicking "Update & Publish")
- **Message:** "Blog submitted for moderator approval!"
- **Behavior:** Re-submitted to moderators

### 4. Status Badge Display

**myblogs.tsx Component:**
```tsx
<div className="myblog-card__status-badge">
    {blog.status === 'published' || blog.status === 'approved' ? (
        <span className="myblog-card__badge myblog-card__badge--published">
            {blog.status === 'approved' ? 'Approved' : 'Published'}
        </span>
    ) : blog.status === 'pending' ? (
        <span className="myblog-card__badge myblog-card__badge--pending">
            Pending Approval
        </span>
    ) : blog.status === 'rejected' ? (
        <span className="myblog-card__badge myblog-card__badge--rejected">
            Rejected
        </span>
    ) : (
        <span className="myblog-card__badge myblog-card__badge--draft">
            Draft
        </span>
    )}
</div>
```

### 5. Visual Styling

**myblogs.scss:**
```scss
.myblog-card__badge {
    // Base styles...
    
    &--published {
        // Green gradient for published/approved
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.9));
        color: #dcfce7;
    }
    
    &--draft {
        // Yellow/amber gradient for drafts
        background: linear-gradient(135deg, rgba(251, 191, 36, 0.9), rgba(217, 119, 6, 0.9));
        color: #fef3c7;
    }
    
    &--pending {
        // Blue gradient for pending approval
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(29, 78, 216, 0.9));
        color: #dbeafe;
    }
    
    &--rejected {
        // Red gradient for rejected posts
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.9));
        color: #fee2e2;
    }
}
```

## User Experience

### For Content Creators (Influencers)

1. **Creating a Blog:**
   - Click "Create New Blog"
   - Fill in title and content
   - Optionally add featured image
   - Two options:
     - **Save as Draft:** Keeps blog in draft status (not submitted)
     - **Publish:** Submits blog for moderator approval (status: `pending`)

2. **Status Indicators:**
   - **Draft** (Yellow): Work in progress, not submitted
   - **Pending Approval** (Blue): Submitted to moderators, waiting for review
   - **Approved** (Green): Approved by moderator, visible to public
   - **Rejected** (Red): Rejected by moderator, needs revision

3. **Editing:**
   - Can edit blogs in any status
   - When clicking "Update & Publish" on a draft/rejected blog, it goes to `pending`
   - When clicking "Update as Draft", status remains `draft`

### For Moderators (Future Implementation)

Moderators will be able to:
1. View all blogs with `pending` status
2. Review content and images
3. Make decision:
   - **Approve:** Changes status to `approved` (published to public)
   - **Reject:** Changes status to `rejected` (with optional reason)
   - **Request Changes:** Keep as `pending` with comments

## Backend API Requirements

The backend should support these status transitions:

```
Draft ──────────────────────────> Pending
                                     │
                                     ├──> Approved (Moderator Action)
                                     │
                                     └──> Rejected (Moderator Action)
                                            │
                                            └──> Pending (User Re-submits)
```

**API Endpoints Expected:**

1. **POST /api/blogs** - Create blog with `status: 'pending'`
2. **PUT /api/blogs/:id** - Update blog (can change status)
3. **GET /api/blogs** - Filter by status (`?status=pending` for moderation queue)
4. **PUT /api/blogs/:id/moderate** - Moderator endpoint to approve/reject

## Files Modified

1. **frontend/src/services/blogService.ts**
   - Updated `Blog` interface with new status types
   - Updated `CreateBlogRequest` interface
   - Updated `UpdateBlogRequest` interface
   - Updated `BlogFilters` interface

2. **frontend/src/pages/influencer/myblogs.tsx**
   - Updated local `Blog` type definition
   - Changed `handleCreateBlog()` to use `status: 'pending'`
   - Changed `handlePublishBlog()` to use `status: 'pending'`
   - Changed `handleUpdateBlog()` to use `status: 'pending'` when publishing
   - Updated success messages to reflect moderation workflow
   - Enhanced status badge display logic

3. **frontend/src/styles/pages/influencer/myblogs.scss**
   - Added `--pending` badge styling (blue gradient)
   - Added `--rejected` badge styling (red gradient)

## Benefits

1. **Content Quality Control:** Moderators can review content before it goes live
2. **Spam Prevention:** Prevents low-quality or spam content from being published
3. **Brand Safety:** Ensures all public content meets community guidelines
4. **User Feedback:** Rejected posts can include feedback for improvement
5. **Audit Trail:** Clear status progression for tracking

## Future Enhancements

1. **Moderator Dashboard:**
   - Queue of pending blogs
   - Quick approve/reject actions
   - Add rejection reasons
   - Bulk moderation tools

2. **Notifications:**
   - Notify user when blog is approved
   - Notify user when blog is rejected (with reason)
   - Notify moderators of new pending submissions

3. **Analytics:**
   - Approval rate tracking
   - Average moderation time
   - Rejection reasons analytics

4. **Auto-Moderation:**
   - AI-based content filtering
   - Automatic approval for trusted users
   - Flagging system for problematic content

## Testing Checklist

- [ ] Create new blog with "Publish" → Status shows "Pending Approval"
- [ ] Create new blog with "Save as Draft" → Status shows "Draft"
- [ ] Edit draft and publish → Status changes to "Pending Approval"
- [ ] Edit pending blog → Status remains "Pending"
- [ ] Status badge displays correct color and text for each status
- [ ] Success message shows "submitted for moderator approval"
- [ ] Backend receives `status: 'pending'` in requests
- [ ] Moderator can change status to `approved` or `rejected`
- [ ] Approved blogs appear in public feed
- [ ] Rejected blogs show rejection status to author

## Notes

- **Image Upload:** Image upload still works with multipart/form-data
- **Backward Compatibility:** Existing published blogs remain unaffected
- **Draft Behavior:** Drafts are not submitted for approval until user clicks "Publish"
- **Re-submission:** Rejected blogs can be edited and re-submitted (status changes to `pending` again)
