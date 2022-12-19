import { expect, test } from '@jupyterlab/galata';
import { Page } from '@playwright/test';

/**
 * Don't load JupyterLab webpage before running the tests.
 * This is required to ensure we capture all log messages.
 */
test.use({ autoGoto: false });

test('should emit an activation console message', async ({
  page
}: {
  page: Page;
}) => {
  const logs: string[] = [];

  page.on('console', message => {
    logs.push(message.text());
  });

  await page.goto();
  await page.filebrowser.open('examples/events.simplay');

  expect(
    logs.filter(s => s === 'JupyterLab extension simplay_jupyter is activated!')
  ).toHaveLength(1);
});

test('should stop and pause simulation', async ({ page }: { page: Page }) => {
  await page.goto();
  await page.filebrowser.open('examples/events.simplay');

  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
});
