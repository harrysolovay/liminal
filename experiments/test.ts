import { AsyncLocalStorage } from "node:async_hooks"

const asyncLocalStorage = new AsyncLocalStorage<string>()

function logWithId(msg: string) {
  const id = asyncLocalStorage.getStore()
  console.log(`${id !== undefined ? id : "-"}:`, msg)
}
asyncLocalStorage.run("HELLO!", () => {
  const value = asyncLocalStorage.getStore()
  console.log(value)
  asyncLocalStorage.run("another!", () => {
    const value = asyncLocalStorage.getStore()
    console.log("another!", value)
  })
})
asyncLocalStorage.run("WORLD!", () => {
  const value = asyncLocalStorage.getStore()
  console.log(value)
})
