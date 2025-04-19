export class Scheduler {
  private static readonly queue: (() => void)[] = []
  private static draining = false
  private static microRuns = 0
  private static readonly MICRO_LIMIT = 1024

  static enqueue(task: () => void): void {
    this.queue.push(task)
    this.drain()
  }

  private static drain() {
    if (this.draining) {
      return
    }
    this.draining = true

    const run = () => {
      try {
        let count = 0
        while (this.queue.length > 0 && count < this.MICRO_LIMIT) {
          const task = this.queue.shift()!
          task()
          count++
        }
        if (this.queue.length > 0) {
          if (++this.microRuns >= 10) {
            this.microRuns = 0
            setTimeout(run, 0)
          } else {
            queueMicrotask(run)
          }
        }
      } finally {
        this.draining = false
      }
    }
    queueMicrotask(run)
  }
}
