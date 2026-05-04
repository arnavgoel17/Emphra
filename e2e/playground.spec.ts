import { test, expect } from '@playwright/test';

test('simulate playground interaction', async ({ page }) => {
  // Navigate to the demo page
  await page.goto('http://localhost:3000/demo');

  const inputs = [
    "Hello!",
    "This is a great platform!",
    "You are an idiot.", 
    "Send me your bank details",
    "What is the weather like?"
  ];

  const chatInput = page.locator('input[placeholder*="Message"]');
  const sendButton = page.locator('button[type="submit"]');

  for (const text of inputs) {
    console.log(`Simulating: "${text}"`);
    await chatInput.fill(text);
    await sendButton.click();
    
    // Wait for the message to appear or analyze
    await page.waitForTimeout(1000); 
    
    // Check for safety dialog if triggered
    const safetyDialog = page.locator('text=Potentially Harmful Content');
    if (await safetyDialog.isVisible()) {
      console.log('Safety dialog triggered!');
      await page.locator('text=Apply Suggestion').click();
      await page.waitForTimeout(1000);
    }
  }
});
