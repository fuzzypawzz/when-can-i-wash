const observers = Symbol('observers')

export class Observable<
  TEvent extends {
    eventName: string
    data?: Record<string, unknown>
  }
> {
  private [observers]: ((event: TEvent) => unknown)[]

  constructor() {
    this[observers] = []
  }

  public subscribe(func: (event: TEvent) => unknown): () => void {
    this[observers].push(func)

    return () => this.unsubscribe(func)
  }

  public notify(event: TEvent): void {
    this[observers].forEach((observer) => observer(event))
  }

  public unsubscribe(func: (event: TEvent) => unknown): void {
    const index = this[observers].findIndex((callback) => callback === func)

    if (index !== -1) this[observers].splice(index, 1)
  }

  public unsubscribeAll(): void {
    this[observers].forEach((callback) => this.unsubscribe(callback))
  }
}
