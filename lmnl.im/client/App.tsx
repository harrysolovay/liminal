export const App = () => <div>App</div>

// import { Atom, useAtom, useAtomSet } from "@effect-atom/atom-react"
// import { Effect, Exit } from "effect"
// import { ImClient } from "./ImClient.ts"

// const runtimeRx: Atom.AtomRuntime<ImClient, never> = Atom.runtime(ImClient.Default)

// const messageRx = Atom.make<string | undefined>(undefined)

// const postAtom = runtimeRx.fn(Effect.fnUntraced(function*(message: string) {
//   const im = yield* ImClient
//   return yield* im.v1.sendMessage({
//     payload: { message },
//   })
// }))

// export const App = () => {
//   const [message, setMessage] = useAtom(messageRx)
//   const sendMessage = useAtomSet(postAtom, {
//     mode: "promiseExit",
//   })
//   return (
//     <div>
//       <button
//         onClick={async () => {
//           Exit.match(await sendMessage("the message here"), {
//             onSuccess: setMessage,
//             onFailure: (cause) => {
//               console.log(cause)
//             },
//           })
//         }}
//       >
//         GO!
//       </button>
//       <div>The message: {message}</div>
//     </div>
//   )
// }
