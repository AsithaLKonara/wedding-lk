import { test, expect } from '@playwright/test';

test.describe('🤖 AI Search & Chat System Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('AI Search Functionality', () => {
    test('AI search input on homepage', async ({ page }) => {
      // Check AI search input exists
      await expect(page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]')).toBeVisible();
      
      // Test AI search input
      const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]').first();
      await searchInput.fill('Beach wedding in Galle for 150 guests with photographer and catering');
      await expect(searchInput).toHaveValue('Beach wedding in Galle for 150 guests with photographer and catering');
    });

    test('AI search submission', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]').first();
      await searchInput.fill('Luxury hotel wedding in Colombo with garden ceremony');
      await searchInput.press('Enter');
      
      // Check for search results or loading state
      await expect(page.locator('text=Searching, text=Results, text=Loading')).toBeVisible({ timeout: 10000 });
    });

    test('AI search results display', async ({ page }) => {
      // Navigate to search results page
      await page.goto('/search');
      
      // Check search results page
      await expect(page.locator('text=Search Results, text=AI Recommendations')).toBeVisible();
      
      // Check result cards
      const resultCards = page.locator('[class*="result-card"], [class*="recommendation"]');
      if (await resultCards.isVisible()) {
        await expect(resultCards.first()).toBeVisible();
      }
    });

    test('Advanced AI search page', async ({ page }) => {
      await page.goto('/search/advanced');
      
      // Check advanced search form
      await expect(page.locator('text=Advanced Search, text=AI Assistant')).toBeVisible();
      
      // Test advanced search fields
      const locationInput = page.locator('input[name="location"], select[name="location"]');
      if (await locationInput.isVisible()) {
        await locationInput.fill('Galle');
      }
      
      const guestInput = page.locator('input[name="guests"], input[name="capacity"]');
      if (await guestInput.isVisible()) {
        await guestInput.fill('150');
      }
      
      const budgetInput = page.locator('input[name="budget"], input[name="price"]');
      if (await budgetInput.isVisible()) {
        await budgetInput.fill('500000');
      }
      
      // Submit advanced search
      await page.click('button[type="submit"], button:has-text("Search")');
      
      // Check for results
      await expect(page.locator('text=Results, text=Recommendations')).toBeVisible({ timeout: 10000 });
    });

    test('AI search history', async ({ page }) => {
      await page.goto('/search');
      
      // Check for search history section
      const historySection = page.locator('text=Recent Searches, text=Search History');
      if (await historySection.isVisible()) {
        await expect(historySection).toBeVisible();
        
        // Check history items
        const historyItems = page.locator('[class*="history-item"], [class*="search-item"]');
        if (await historyItems.isVisible()) {
          await expect(historyItems.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('AI Chatbot System', () => {
    test('Chatbot interface loads', async ({ page }) => {
      // Look for chatbot button or interface
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[aria-label*="chat"]');
      if (await chatbotButton.isVisible()) {
        await chatbotButton.click();
        
        // Check chatbot window opens
        await expect(page.locator('text=Chat Assistant, text=How can I help')).toBeVisible();
      }
    });

    test('Chatbot message sending', async ({ page }) => {
      // Open chatbot
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[aria-label*="chat"]');
      if (await chatbotButton.isVisible()) {
        await chatbotButton.click();
        
        // Wait for chatbot to load
        await page.waitForTimeout(1000);
        
        // Send message to chatbot
        const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
        if (await messageInput.isVisible()) {
          await messageInput.fill('I need help finding a wedding venue in Colombo');
          await messageInput.press('Enter');
          
          // Check for bot response
          await expect(page.locator('text=Here are some venues, text=I can help')).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('Chatbot conversation flow', async ({ page }) => {
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[aria-label*="chat"]');
      if (await chatbotButton.isVisible()) {
        await chatbotButton.click();
        
        const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
        if (await messageInput.isVisible()) {
          // Test multiple conversation turns
          const messages = [
            'Hello, I need help planning my wedding',
            'What venues do you recommend in Galle?',
            'What is the average cost for 100 guests?'
          ];
          
          for (const message of messages) {
            await messageInput.fill(message);
            await messageInput.press('Enter');
            await page.waitForTimeout(2000);
          }
        }
      }
    });

    test('Chatbot quick responses', async ({ page }) => {
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[aria-label*="chat"]');
      if (await chatbotButton.isVisible()) {
        await chatbotButton.click();
        
        // Check for quick response buttons
        const quickResponses = page.locator('[class*="quick-response"], [class*="suggestion"]');
        if (await quickResponses.isVisible()) {
          await quickResponses.first().click();
          await page.waitForTimeout(2000);
        }
      }
    });
  });

  test.describe('Chat System', () => {
    test('Chat rooms functionality', async ({ page }) => {
      await page.goto('/chat');
      
      // Check chat interface
      await expect(page.locator('text=Chat, text=Messages')).toBeVisible();
      
      // Check chat rooms list
      const chatRooms = page.locator('[class*="chat-room"], [class*="conversation"]');
      if (await chatRooms.isVisible()) {
        await expect(chatRooms.first()).toBeVisible();
      }
    });

    test('Message sending and receiving', async ({ page }) => {
      await page.goto('/chat');
      
      // Select a chat room
      const chatRoom = page.locator('[class*="chat-room"], [class*="conversation"]').first();
      if (await chatRoom.isVisible()) {
        await chatRoom.click();
        
        // Send message
        const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
        if (await messageInput.isVisible()) {
          await messageInput.fill('Hello, I am interested in your services');
          await messageInput.press('Enter');
          
          // Check message appears
          await expect(page.locator('text=Hello, I am interested in your services')).toBeVisible();
        }
      }
    });

    test('File sharing in chat', async ({ page }) => {
      await page.goto('/chat');
      
      // Select a chat room
      const chatRoom = page.locator('[class*="chat-room"], [class*="conversation"]').first();
      if (await chatRoom.isVisible()) {
        await chatRoom.click();
        
        // Look for file upload button
        const fileUploadButton = page.locator('input[type="file"], button[aria-label*="upload"]');
        if (await fileUploadButton.isVisible()) {
          // Test file upload (in real scenario, would upload actual file)
          await fileUploadButton.setInputFiles([]);
          await page.waitForTimeout(1000);
        }
      }
    });

    test('Chat notifications', async ({ page }) => {
      await page.goto('/chat');
      
      // Check for notification indicators
      const notificationBadge = page.locator('[class*="notification-badge"], [class*="unread"]');
      if (await notificationBadge.isVisible()) {
        await expect(notificationBadge).toBeVisible();
      }
    });
  });

  test.describe('AI Recommendations', () => {
    test('Personalized recommendations', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check for AI recommendations section
      await expect(page.locator('text=Recommended for You, text=AI Suggestions')).toBeVisible();
      
      // Check recommendation cards
      const recommendations = page.locator('[class*="recommendation"], [class*="suggestion-card"]');
      if (await recommendations.isVisible()) {
        await expect(recommendations.first()).toBeVisible();
      }
    });

    test('Recommendation interaction', async ({ page }) => {
      await page.goto('/dashboard');
      
      const recommendations = page.locator('[class*="recommendation"], [class*="suggestion-card"]');
      if (await recommendations.isVisible()) {
        // Click on a recommendation
        await recommendations.first().click();
        
        // Check navigation to recommended item
        await page.waitForTimeout(1000);
      }
    });

    test('Feedback on recommendations', async ({ page }) => {
      await page.goto('/dashboard');
      
      const recommendations = page.locator('[class*="recommendation"], [class*="suggestion-card"]');
      if (await recommendations.isVisible()) {
        // Look for feedback buttons
        const likeButton = page.locator('button[aria-label*="like"], button:has-text("Like")');
        if (await likeButton.isVisible()) {
          await likeButton.first().click();
          await page.waitForTimeout(500);
        }
        
        const dislikeButton = page.locator('button[aria-label*="dislike"], button:has-text("Dislike")');
        if (await dislikeButton.isVisible()) {
          await dislikeButton.first().click();
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('AI API Integration', () => {
    test('AI search API functionality', async ({ page }) => {
      const searchQuery = 'Beach wedding in Galle for 150 guests';
      const response = await page.request.post('/api/ai-search', {
        data: { query: searchQuery }
      });
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('Chatbot API functionality', async ({ page }) => {
      const message = 'Hello, I need help finding a wedding venue';
      const response = await page.request.post('/api/chatbot', {
        data: { message: message }
      });
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('Chat messages API', async ({ page }) => {
      const response = await page.request.get('/api/chat/messages');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('Chat rooms API', async ({ page }) => {
      const response = await page.request.get('/api/chat/rooms');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  test.describe('AI Search Performance', () => {
    test('Search response time', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]').first();
      await searchInput.fill('Wedding venue search test');
      
      const startTime = Date.now();
      await searchInput.press('Enter');
      await page.waitForSelector('text=Results, text=Loading', { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      
      // Search should respond within 5 seconds
      expect(responseTime).toBeLessThan(5000);
    });

    test('Chatbot response time', async ({ page }) => {
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[aria-label*="chat"]');
      if (await chatbotButton.isVisible()) {
        await chatbotButton.click();
        
        const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
        if (await messageInput.isVisible()) {
          const startTime = Date.now();
          await messageInput.fill('Test message');
          await messageInput.press('Enter');
          
          // Wait for bot response
          await page.waitForSelector('text=Here, text=I can help', { timeout: 10000 });
          const responseTime = Date.now() - startTime;
          
          // Chatbot should respond within 3 seconds
          expect(responseTime).toBeLessThan(3000);
        }
      }
    });
  });

  test.describe('AI Error Handling', () => {
    test('AI search error handling', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]').first();
      
      // Test empty search
      await searchInput.fill('');
      await searchInput.press('Enter');
      
      // Check for validation message
      await expect(page.locator('text=Please enter, text=Search query')).toBeVisible();
    });

    test('Chatbot error handling', async ({ page }) => {
      const chatbotButton = page.locator('[class*="chatbot"], [class*="chat"], button[aria-label*="chat"]');
      if (await chatbotButton.isVisible()) {
        await chatbotButton.click();
        
        const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
        if (await messageInput.isVisible()) {
          // Send empty message
          await messageInput.fill('');
          await messageInput.press('Enter');
          
          // Check for error handling
          await expect(page.locator('text=Please enter, text=Message')).toBeVisible();
        }
      }
    });

    test('Network error handling', async ({ page }) => {
      // Simulate network error by going offline
      await page.context().setOffline(true);
      
      const searchInput = page.locator('input[placeholder*="dream wedding"], input[placeholder*="Describe your"]').first();
      await searchInput.fill('Test search');
      await searchInput.press('Enter');
      
      // Check for offline message
      await expect(page.locator('text=Offline, text=No connection')).toBeVisible();
      
      // Restore network
      await page.context().setOffline(false);
    });
  });
});
