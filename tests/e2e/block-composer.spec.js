import { test, expect } from '@playwright/test'

test.describe('BlockComposer add-block flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadence-composer/')
  })

  test('adds a new block and updates the debug readout', async ({ page }) => {
    const draft = page.getByPlaceholder('Paste HTML with {{tag}} placeholders...')
    const addButton = page.getByRole('button', { name: 'Add block' })
    const debugReadout = page.locator('text=/Blocks: \\d+/')

    await expect(draft).toBeVisible()
    await expect(addButton).toBeVisible()

    await draft.fill('<div>Hello {{name}}, welcome to {{company}}!</div>')
    await expect(debugReadout).toHaveText('Blocks: 0')

    await addButton.click()
    await expect(debugReadout).toHaveText('Blocks: 1')

    const blockCard = page.locator('.block-card').first()
    await expect(blockCard).toBeVisible()
    await expect(blockCard.locator('textarea')).toHaveValue('<div>Hello {{name}}, welcome to {{company}}!</div>')
  })
})