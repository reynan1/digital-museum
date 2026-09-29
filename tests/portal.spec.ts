import { test, expect } from '@playwright/test';

test('portal animates, pauses, resumes and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('.portal-canvas');
  await expect(canvas).toHaveCSS('opacity', '1');
  const first = await canvas.screenshot();
  await page.mouse.move(1100, 400);
  await expect.poll(async () => first.equals(await canvas.screenshot())).toBe(false);
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await expect(canvas).toHaveCSS('opacity', '0');
  await page.getByRole('button', { name: 'Resume animation' }).click();
  await expect(canvas).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(canvas).toBeHidden();
  await expect(page.getByRole('link', { name: 'Enter the time portal' })).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(canvas).toHaveCSS('opacity', '1');
  await expect(page.getByRole('button', { name: 'Pause animation' })).toBeVisible();
});
