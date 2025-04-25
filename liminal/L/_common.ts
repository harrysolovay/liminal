export class RequestCounter {
  static count: number = 0
  static next(): number {
    return this.count++
  }
}
