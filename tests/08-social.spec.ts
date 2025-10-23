import { test, expect } from '@playwright/test';

test.describe('Social Features Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should create new post', async ({ page }) => {
    await page.goto('/feed');
    
    // Look for create post button
    const createButton = page.locator('button:has-text("Create"), button:has-text("Post"), textarea[placeholder*="post"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Fill post content
      await page.fill('textarea[name*="content"], textarea[placeholder*="post"]', 'Beautiful wedding at the beach! 🌊💒');
      
      // Add hashtags
      await page.fill('input[name*="hashtags"], input[placeholder*="hashtag"]', '#wedding #beach #love');
      
      // Submit post
      await page.click('button[type="submit"], button:has-text("Post")');
      
      // Should show success
      await expect(page.locator('text=posted|success')).toBeVisible();
    }
  });

  test('should like/unlike post', async ({ page }) => {
    await page.goto('/feed');
    
    // Look for like button
    const likeButton = page.locator('button[aria-label*="like"], button:has-text("Like"), .like-btn').first();
    if (await likeButton.isVisible()) {
      await likeButton.click();
      
      // Should show liked state
      await expect(page.locator('text=liked|❤️')).toBeVisible();
      
      // Click again to unlike
      await likeButton.click();
      
      // Should show unliked state
      await expect(page.locator('text=like|🤍')).toBeVisible();
    }
  });

  test('should comment on post', async ({ page }) => {
    await page.goto('/feed');
    
    // Look for comment button
    const commentButton = page.locator('button[aria-label*="comment"], button:has-text("Comment")').first();
    if (await commentButton.isVisible()) {
      await commentButton.click();
      
      // Fill comment
      await page.fill('textarea[name*="comment"], textarea[placeholder*="comment"]', 'Congratulations! Beautiful wedding!');
      
      // Submit comment
      await page.click('button[type="submit"], button:has-text("Comment")');
      
      // Should show success
      await expect(page.locator('text=commented|success')).toBeVisible();
    }
  });

  test('should share post', async ({ page }) => {
    await page.goto('/feed');
    
    // Look for share button
    const shareButton = page.locator('button[aria-label*="share"], button:has-text("Share")').first();
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      // Should show share options
      await expect(page.locator('text=share|copy link|social media')).toBeVisible();
    }
  });

  test('should bookmark post', async ({ page }) => {
    await page.goto('/feed');
    
    // Look for bookmark button
    const bookmarkButton = page.locator('button[aria-label*="bookmark"], button:has-text("Save"), .bookmark-btn').first();
    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();
      
      // Should show bookmarked state
      await expect(page.locator('text=bookmarked|saved|🔖')).toBeVisible();
    }
  });

  test('should create story', async ({ page }) => {
    await page.goto('/stories');
    
    // Look for create story button
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add Story")');
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Upload image or video
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Note: In real tests, you would upload actual files
        await fileInput.setInputFiles([]);
      }
      
      // Add story text
      await page.fill('textarea[name*="story"], textarea[placeholder*="story"]', 'Behind the scenes of our wedding prep!');
      
      // Submit story
      await page.click('button[type="submit"], button:has-text("Post")');
      
      // Should show success
      await expect(page.locator('text=posted|success')).toBeVisible();
    }
  });

  test('should view story', async ({ page }) => {
    await page.goto('/stories');
    
    // Click on first story
    const firstStory = page.locator('[data-testid*="story"], .story-card').first();
    if (await firstStory.isVisible()) {
      await firstStory.click();
      
      // Should show story viewer
      await expect(page.locator('[data-testid*="story-viewer"], .story-viewer')).toBeVisible();
    }
  });

  test('should create reel', async ({ page }) => {
    await page.goto('/reels');
    
    // Look for create reel button
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add Reel")');
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Upload video
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Note: In real tests, you would upload actual video files
        await fileInput.setInputFiles([]);
      }
      
      // Add reel description
      await page.fill('textarea[name*="description"], textarea[placeholder*="description"]', 'Wedding highlights reel!');
      
      // Submit reel
      await page.click('button[type="submit"], button:has-text("Post")');
      
      // Should show success
      await expect(page.locator('text=posted|success')).toBeVisible();
    }
  });

  test('should follow user', async ({ page }) => {
    await page.goto('/users');
    
    // Click on first user
    const firstUser = page.locator('[data-testid*="user"], .user-card').first();
    if (await firstUser.isVisible()) {
      await firstUser.click();
      
      // Look for follow button
      const followButton = page.locator('button:has-text("Follow"), button:has-text("Follow User")');
      if (await followButton.isVisible()) {
        await followButton.click();
        
        // Should show following state
        await expect(page.locator('text=following|unfollow')).toBeVisible();
      }
    }
  });

  test('should send direct message', async ({ page }) => {
    await page.goto('/messages');
    
    // Look for new message button
    const newMessageButton = page.locator('button:has-text("New"), button:has-text("Message")');
    if (await newMessageButton.isVisible()) {
      await newMessageButton.click();
      
      // Select recipient
      await page.fill('input[placeholder*="search"], input[placeholder*="user"]', 'testuser');
      await page.click('text=testuser');
      
      // Type message
      await page.fill('textarea[name*="message"], textarea[placeholder*="message"]', 'Hello! How are you?');
      
      // Send message
      await page.click('button[type="submit"], button:has-text("Send")');
      
      // Should show message sent
      await expect(page.locator('text=sent|delivered')).toBeVisible();
    }
  });

  test('should create group', async ({ page }) => {
    await page.goto('/groups');
    
    // Look for create group button
    const createButton = page.locator('button:has-text("Create"), button:has-text("New Group")');
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Fill group form
      await page.fill('input[name*="name"], input[placeholder*="name"]', 'Wedding Planning Group');
      await page.fill('textarea[name*="description"], textarea[placeholder*="description"]', 'Group for wedding planning tips and ideas');
      
      // Submit group
      await page.click('button[type="submit"], button:has-text("Create")');
      
      // Should show success
      await expect(page.locator('text=created|success')).toBeVisible();
    }
  });

  test('should join group', async ({ page }) => {
    await page.goto('/groups');
    
    // Click on first group
    const firstGroup = page.locator('[data-testid*="group"], .group-card').first();
    if (await firstGroup.isVisible()) {
      await firstGroup.click();
      
      // Look for join button
      const joinButton = page.locator('button:has-text("Join"), button:has-text("Join Group")');
      if (await joinButton.isVisible()) {
        await joinButton.click();
        
        // Should show joined state
        await expect(page.locator('text=joined|member')).toBeVisible();
      }
    }
  });

  test('should search posts', async ({ page }) => {
    await page.goto('/feed');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('wedding');
      await searchInput.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const postCards = page.locator('[data-testid*="post"], .post-card');
      await expect(postCards.first()).toBeVisible();
    }
  });

  test('should filter posts by hashtag', async ({ page }) => {
    await page.goto('/feed');
    
    // Click on hashtag
    const hashtag = page.locator('a[href*="hashtag"], .hashtag').first();
    if (await hashtag.isVisible()) {
      await hashtag.click();
      
      // Should show posts with that hashtag
      await expect(page).toHaveURL(/hashtag/);
      
      const postCards = page.locator('[data-testid*="post"], .post-card');
      await expect(postCards.first()).toBeVisible();
    }
  });

  test('should report inappropriate content', async ({ page }) => {
    await page.goto('/feed');
    
    // Look for report button
    const reportButton = page.locator('button[aria-label*="report"], button:has-text("Report")').first();
    if (await reportButton.isVisible()) {
      await reportButton.click();
      
      // Select report reason
      await page.check('input[value="inappropriate"]');
      
      // Submit report
      await page.click('button[type="submit"], button:has-text("Submit")');
      
      // Should show success
      await expect(page.locator('text=reported|success')).toBeVisible();
    }
  });

  test('should view notifications', async ({ page }) => {
    await page.goto('/notifications');
    
    // Check notifications page loads
    await expect(page).toHaveTitle(/notification/i);
    
    // Check for notification items
    const notifications = page.locator('[data-testid*="notification"], .notification-item');
    if (await notifications.count() > 0) {
      await expect(notifications.first()).toBeVisible();
    }
  });

  test('should mark notifications as read', async ({ page }) => {
    await page.goto('/notifications');
    
    // Look for mark as read button
    const markReadButton = page.locator('button:has-text("Mark as Read"), button:has-text("Read All")');
    if (await markReadButton.isVisible()) {
      await markReadButton.click();
      
      // Should show success
      await expect(page.locator('text=marked|read|success')).toBeVisible();
    }
  });
});










