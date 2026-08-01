import { test, expect } from '@playwright/test'

test.describe('Visual regression - BlockComposer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadence-composer/')
    await page.waitForLoadState('networkidle')
  })

  test('homepage matches baseline', async ({ page }) => {
    await page.waitForSelector('#root', { state: 'visible' })
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('composer with draft matches baseline', async ({ page }) => {
    const draft = page.getByPlaceholder('Paste HTML with {{tag}} placeholders...')
    await draft.fill('<div>Hello {{name}}, welcome to {{company}}!</div>')
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('composer-with-draft.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('composer with block added matches baseline', async ({ page }) => {
    const draft = page.getByPlaceholder('Paste HTML with {{tag}} placeholders...')
    const addButton = page.getByRole('button', { name: 'Add block' })
    await draft.fill('<div>Hello {{name}}, welcome to {{company}}!</div>')
    await addButton.click()
    await page.waitForTimeout(300)
    await expect(page).toHaveScreenshot('composer-with-block.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})