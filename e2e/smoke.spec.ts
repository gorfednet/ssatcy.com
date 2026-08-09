import { test, expect } from '@playwright/test'

const routes = ['/', '/bio', '/music', '/film', '/games', '/live', '/gallery', '/contact']

test.describe('smoke', () => {
  for (const route of routes) {
    test(`route ${route} loads`, async ({ page }) => {
      const errors: string[] = []
      const failedAssets: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('response', (response) => {
        if (
          response.status() >= 400 &&
          response.request().resourceType() === 'image'
        ) {
          failedAssets.push(`${response.status()} ${response.url()}`)
        }
      })

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(response?.status()).toBeLessThan(400)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('body')).toBeVisible()
      expect(errors, `page errors on ${route}: ${errors.join('; ')}`).toEqual([])
      expect(
        failedAssets,
        `failed images on ${route}: ${failedAssets.join('; ')}`,
      ).toEqual([])

      const brokenImages = await page.locator('img').evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
      )
      expect(
        brokenImages,
        `broken rendered images on ${route}: ${brokenImages.join('; ')}`,
      ).toEqual([])
    })
  }
})
