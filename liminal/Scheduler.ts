export class Scheduler {
  private static readonly queue: Array<(() => void)> = []
  private static draining = false

  static enqueue(task: () => void): void {
    this.queue.push(task)
    if (!this.draining) {
      this.draining = true
      queueMicrotask(function run() {
        const task = Scheduler.queue.shift()
        if (task) {
          try {
            task()
          } finally {
            queueMicrotask(run)
          }
        } else {
          Scheduler.draining = false
        }
      })
    }
  }
}
