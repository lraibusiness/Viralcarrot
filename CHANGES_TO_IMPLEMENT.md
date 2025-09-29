# Changes to Implement

## 1. Header Navigation Links (src/app/page.tsx)
- Add Blog, About, Contact, Privacy links to header
- Location: Between logo and user authentication section

## 2. Admin Privileges  
- Update src/app/dashboard/page.tsx: Allow admin to create blogs
- Update src/app/blog/write/page.tsx: Allow admin access
- Update src/app/api/blog/posts/route.ts: Allow admin to create blogs

## 3. User Recipe Limit (3 total, not daily)
- Update src/app/dashboard/page.tsx: Show X/3 counter
- Create src/app/api/user/usage/route.ts: Track usage
- Update recipe submission to check limit

## 4. Premium Upgrade in Dashboard
- Add "Upgrade to Premium" section in normal user dashboard
- Show comparison of free vs premium features
- Link to /premium page

## 5. Blog Creation Restrictions
- Update src/app/dashboard/page.tsx: Hide blog button for normal users
- Update src/app/blog/write/page.tsx: Add role check
- Show message for normal users to upgrade

## 6. Blog Approval Flow (Verify)
- Check src/app/api/blog/posts/route.ts: is Published: false is set
- Verify admin approval is required

## 7. Fix Duplicate Text
- src/components/auth/LoginForm.tsx: Remove duplicate signup text  
- src/components/auth/RegisterForm.tsx: Remove duplicate login text
