import { test, expect } from '@playwright/test';

test('hero sun reveals memories with keyboard and mobile controls', async ({ page }) => {
  await page.goto('/');
  const sun = page.getByRole('button', { name: 'Reveal a memory' });
  await sun.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Rediscover the 1990s' })).toHaveAttribute('href', '/galleries/1990s');
  await page.setViewportSize({ width: 390, height: 844 });
  await sun.click();
  await expect(page.getByRole('link', { name: 'Rediscover the 2000s' })).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await sun.click();
  await expect(page.getByRole('link', { name: 'Rediscover the 2010s' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/interactive-title-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.screenshot({ path: 'test-results/interactive-title-desktop.png', fullPage: true });
});

test('homepage previews each decade and opens the chosen gallery', async ({ page }) => {
  await page.goto('/');
  const explorer = page.getByRole('region', { name: 'Choose your decade' });
  for (const era of ['1990s', '2000s', '2010s', '2020s']) {
    await explorer.getByRole('button', { name: era, exact: true }).click();
    await expect(explorer.getByRole('button', { name: era, exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(explorer.getByRole('link')).toHaveAttribute('href', `/galleries/${era}`);
  }
  await explorer.getByRole('button', { name: 'Surprise me' }).click();
  await expect(explorer.getByRole('button', { name: '2020s', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await explorer.getByRole('button', { name: '1990s', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(explorer.getByRole('link')).toHaveAttribute('href', '/galleries/1990s');
  await page.setViewportSize({ width: 390, height: 844 });
  await explorer.getByRole('link').click();
  await expect(page).toHaveURL(/\/galleries\/1990s$/);
});
