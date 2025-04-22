export class Counter {
  constructor(public count: number = 0) {}

  next() {
    return this.count++
  }

  clone() {
    return new Counter(this.count)
  }
}
