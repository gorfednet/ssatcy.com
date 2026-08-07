import { test, expect } from '@playwright/test'

const routes = ['/', '/bio', '/music', '/film', '/games', '/live', '/gallery', '/contact']

test.describe('smoke', () => {
  for (const route of routes) {
    test(`route ${route} loads`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))

      const response = await page.goto(route)
      expect(response?.status()).toBeLessThan(400)
      await expect(page.locator('body')).toBeVisible()
      expect(errors, `page errors on ${route}: ${errors.join('; ')}`).toEqual([])
    })
  }
})
