export interface Exec<Y, T> extends AsyncIterator<Y, T> {
  consume(): Promise<T>
}
