import { test } from '@playwright/test'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type AnyFunctionLikeValue = Function
type StepNameFactory<UnknownArgs extends unknown[]> = (...args: UnknownArgs) => string

/**
 * Step name decorator to use in Playwright Page Object Models (test-harnesses)
 *
 * @example
 * class MyTestHarness {
 *  @test('Selects a date')
 *  async selectDateInDatePicker() {
 *    return await this.page.getByLabel('date').fill('...')
 *  }
 *
 *  @step((query) => `Type ${query} in the search field`)
 *  async searchFor(query: string) {
 *    await this.searchField.fill(query)
 *  }
 */
export function step<UnknownArgs extends unknown[]>(
  stepNameOrStepNameFactory?: string | StepNameFactory<UnknownArgs>
) {
  return function decorator(target: AnyFunctionLikeValue, context: ClassMethodDecoratorContext) {
    return function replaceMethod(this: typeof target, ...args: UnknownArgs) {
      const nameOfPageObjectModel = this.constructor.name
      const nameOfMethod = context.name as string
      const fallbackStepName = `${nameOfPageObjectModel}.${nameOfMethod}`

      if (typeof stepNameOrStepNameFactory === 'function') {
        const stepName = stepNameOrStepNameFactory(...args)

        return test.step(stepName, async () => {
          return await target.call(this, ...args)
        })
      }

      return test.step(stepNameOrStepNameFactory || fallbackStepName, async () => {
        return await target.call(this, ...args)
      })
    }
  }
}
