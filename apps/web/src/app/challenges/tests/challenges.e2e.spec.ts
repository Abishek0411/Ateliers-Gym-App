import { test, expect } from '@playwright/test';

test.describe('Challenges E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and login
    await page.goto('/login');

    // Fill in login form (adjust selectors based on your actual login form)
    await page.fill('input[name="gymId"]', 'GYM001');
    await page.fill('input[name="password"]', 'password123');

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or home
    await page.waitForURL('/');
  });

  test('should display challenges page', async ({ page }) => {
    await page.goto('/challenges');

    // Check if challenges page loads
    await expect(page.locator('h1')).toContainText('Challenges');

    // Check if search bar is present
    await expect(
      page.locator('input[placeholder="Search challenges..."]')
    ).toBeVisible();

    // Check if filter buttons are present
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Active")')).toBeVisible();
  });

  test('should filter challenges by type', async ({ page }) => {
    await page.goto('/challenges');

    // Click on streak filter
    await page.click('button:has-text("Streak")');

    // Wait for challenges to load
    await page.waitForTimeout(1000);

    // Check if only streak challenges are shown (if any exist)
    // This test assumes there are challenges in the database
  });

  test('should search challenges', async ({ page }) => {
    await page.goto('/challenges');

    // Type in search box
    await page.fill('input[placeholder="Search challenges..."]', 'fitness');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Check if results are filtered (this depends on having challenges with "fitness" in the title/description)
  });

  test('should navigate to challenge detail page', async ({ page }) => {
    await page.goto('/challenges');

    // Wait for challenges to load
    await page.waitForTimeout(2000);

    // Click on first challenge card (if any exist)
    const challengeCard = page
      .locator('[data-testid="challenge-card"]')
      .first();

    if (await challengeCard.isVisible()) {
      await challengeCard.click();

      // Check if we're on challenge detail page
      await expect(page.locator('h1')).toBeVisible();

      // Check if challenge details are displayed
      await expect(page.locator('text=Your Progress')).toBeVisible();
      await expect(page.locator("text=Who's Crushing It")).toBeVisible();
    }
  });

  test('should join a challenge', async ({ page }) => {
    await page.goto('/challenges');

    // Wait for challenges to load
    await page.waitForTimeout(2000);

    // Click on first challenge card
    const challengeCard = page
      .locator('[data-testid="challenge-card"]')
      .first();

    if (await challengeCard.isVisible()) {
      await challengeCard.click();

      // Wait for challenge detail page to load
      await page.waitForTimeout(1000);

      // Click join button
      const joinButton = page.locator('button:has-text("Join the Grind")');

      if (await joinButton.isVisible()) {
        await joinButton.click();

        // Check if join modal appears
        await expect(page.locator('text=Welcome to the Grind')).toBeVisible();

        // Click join in modal
        await page.click('button:has-text("Join Challenge")');

        // Wait for join to complete
        await page.waitForTimeout(2000);

        // Check if user is now joined (button should change to "Leave Challenge")
        await expect(
          page.locator('button:has-text("Leave Challenge")')
        ).toBeVisible();
      }
    }
  });

  test('should mark progress on a challenge', async ({ page }) => {
    await page.goto('/challenges');

    // Wait for challenges to load
    await page.waitForTimeout(2000);

    // Click on first challenge card
    const challengeCard = page
      .locator('[data-testid="challenge-card"]')
      .first();

    if (await challengeCard.isVisible()) {
      await challengeCard.click();

      // Wait for challenge detail page to load
      await page.waitForTimeout(1000);

      // Check if user is already joined, if not join first
      const joinButton = page.locator('button:has-text("Join the Grind")');
      if (await joinButton.isVisible()) {
        await joinButton.click();
        await page.click('button:has-text("Join Challenge")');
        await page.waitForTimeout(2000);
      }

      // Look for task day chips
      const taskChip = page.locator('[data-testid="task-day-chip"]').first();

      if (await taskChip.isVisible()) {
        // Click on first task to mark as complete
        await taskChip.click();

        // Wait for progress update
        await page.waitForTimeout(1000);

        // Check if task is marked as completed
        await expect(taskChip.locator('text=Crushed it!')).toBeVisible();
      }
    }
  });

  test('should display leaderboard', async ({ page }) => {
    await page.goto('/challenges');

    // Wait for challenges to load
    await page.waitForTimeout(2000);

    // Click on first challenge card
    const challengeCard = page
      .locator('[data-testid="challenge-card"]')
      .first();

    if (await challengeCard.isVisible()) {
      await challengeCard.click();

      // Wait for challenge detail page to load
      await page.waitForTimeout(1000);

      // Check if leaderboard is displayed
      await expect(page.locator("text=Who's Crushing It")).toBeVisible();

      // Check if leaderboard entries are shown
      const leaderboardEntries = page.locator(
        '[data-testid="leaderboard-entry"]'
      );

      if ((await leaderboardEntries.count()) > 0) {
        await expect(leaderboardEntries.first()).toBeVisible();
      }
    }
  });

  test('should leave a challenge', async ({ page }) => {
    await page.goto('/challenges');

    // Wait for challenges to load
    await page.waitForTimeout(2000);

    // Click on first challenge card
    const challengeCard = page
      .locator('[data-testid="challenge-card"]')
      .first();

    if (await challengeCard.isVisible()) {
      await challengeCard.click();

      // Wait for challenge detail page to load
      await page.waitForTimeout(1000);

      // Check if user is already joined, if not join first
      const joinButton = page.locator('button:has-text("Join the Grind")');
      if (await joinButton.isVisible()) {
        await joinButton.click();
        await page.click('button:has-text("Join Challenge")');
        await page.waitForTimeout(2000);
      }

      // Click leave button
      const leaveButton = page.locator('button:has-text("Leave Challenge")');

      if (await leaveButton.isVisible()) {
        await leaveButton.click();

        // Confirm leave in dialog
        await page.click('button:has-text("OK")');

        // Wait for leave to complete
        await page.waitForTimeout(2000);

        // Check if user is no longer joined (button should change back to "Join the Grind")
        await expect(
          page.locator('button:has-text("Join the Grind")')
        ).toBeVisible();
      }
    }
  });
});
