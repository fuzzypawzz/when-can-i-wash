import { afterEach, expect, it, vi } from 'vitest'

import { Observable } from '@/App.Core/infrastructure/helpers/observable/observable'

const mocks = {
  eventArguments: {
    eventName: 'BUTTON_CLICKED',
    data: { isModalShown: true }
  },

  firstSubscriber: vi.fn(),
  secondSubscriber: vi.fn()
}

let observable = new Observable<typeof mocks.eventArguments>()

afterEach(() => {
  observable = new Observable()
  mocks.firstSubscriber.mockClear()
  mocks.secondSubscriber.mockClear()
})

it('sends an event to all subscribers when notify is called', () => {
  observable.subscribe(mocks.firstSubscriber)
  observable.subscribe(mocks.secondSubscriber)

  observable.notify(mocks.eventArguments)

  expect(mocks.firstSubscriber).toHaveBeenCalledWith(mocks.eventArguments)
  expect(mocks.secondSubscriber).toHaveBeenCalledWith(mocks.eventArguments)
})

it('no longer receives events after being unsubscribed', () => {
  observable.subscribe(mocks.firstSubscriber)
  observable.subscribe(mocks.secondSubscriber)

  observable.unsubscribe(mocks.firstSubscriber)

  observable.notify(mocks.eventArguments)

  expect(mocks.firstSubscriber).not.toHaveBeenCalled()
  expect(mocks.secondSubscriber).toHaveBeenCalled()
})
