import { L } from "liminal"

export default function*() {
  yield* L.user`
    Can you please decide on a subtopic for us to discuss within the domain of technological futurism.
    Don't ask any follow-up questions. Just pick a subtopic.
  `
  yield* L.infer()
  yield* L.user`Great, please teach something interesting about your choice of subtopic.`
  yield* L.infer()
  let i = 0
  while (i < 5) {
    const userReply = yield* L.fork(`infer-user-reply-${i}`, function*() {
      yield* L.user`Please answer this question on my behalf (no follow-up questions allowed).`
      return yield* L.infer()
    })
    yield* L.user(userReply)
    yield* L.infer()
    i += 1
  }
  yield* L.user`Please summarize the key points from our conversation.`
  return yield* L.infer()
}
