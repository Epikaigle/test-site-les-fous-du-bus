import { test, expect } from '@playwright/test';

test('l’accueil se charge avec le bon titre', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Les Fous du Bus/);
});

test('la page théorie est accessible depuis la navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'La théorie' }).first().click();
  await expect(page).toHaveURL(/\/theorie$/);
});
