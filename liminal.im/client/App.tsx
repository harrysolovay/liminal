import { Rx, useRx, useRxSetPromise } from "@effect-rx/rx-react"
import { Effect } from "effect"
import { ImClient } from "./ImClient.ts"

const runtimeRx: Rx.RxRuntime<ImClient, never> = Rx.runtime(ImClient.Default)

const postRx = runtimeRx.fn(Effect.fnUntraced(function*(message: string) {
  const im = yield* ImClient
  return yield* im.v1.sendMessage({
    payload: { message },
  })
}))

const messageRx = Rx.make<string | undefined>(undefined)

export const App = () => {
  const [message, setMessage] = useRx(messageRx)
  const sendMessage = useRxSetPromise(postRx)
  return (
    <div>
      <button
        onClick={async () => {
          const result = await sendMessage("the message here")
          console.log({ result })
          if (result._tag === "Success") {
            setMessage(result.value)
          }
        }}
      >
        GO!
      </button>
      <div>The message: {message}</div>
    </div>
  )
}
