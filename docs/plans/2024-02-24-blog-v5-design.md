# Blog v5 - Bug Fixes Design Document

## 1. Project Overview

- **Project Name**: AI Generate Blog System v5
- **Type**: Bug fixes and enhancements
- **Goal**: Add author field to posts and send confirmation email for newsletter subscriptions

## 2. Feature Specifications

### 2.1 Newsletter Email Confirmation
- **Trigger**: When user subscribes to newsletter
- **Provider**: Resend (already configured)
- **Email Content**:
  - Subject: "Welcome to AI Generate Blog System!"
  - Body: Simple confirmation message
- **API Endpoint**: `/api/subscribe` already exists, will add email sending

### 2.2 Article Author
- **Database**: Add author column to posts table
- **UI**: Display author name in post list and post detail
- **Admin**: Add author field in post editor (optional, default to "Admin")

## 3. Data Model Changes

### Post (updated)
```
author: VARCHAR(255) DEFAULT 'Admin'
```

## 4. Technical Implementation

### Newsletter Email
- Install `@resend/node` if not already installed
- Create email template
- Call Resend API after successful subscription
- Handle errors gracefully

### Author Field
- Update `createPost` and `updatePost` functions
- Update Post interface
- Add author input to admin editor
- Display author in post list and detail

## 5. Acceptance Criteria

- [ ] Newsletter subscription sends confirmation email
- [ ] Author field added to database
- [ ] Author displayed in post list
- [ ] Author displayed in post detail
- [ ] Author field in admin editor
- [ ] All tests pass
- [ ] Build succeeds

---

⚠️ **需要批准后才能实现**
