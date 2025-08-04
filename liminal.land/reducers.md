# Liminal Reducers <Badge type="warning" text="beta" />

In the context of Liminal, a reducer is a conversation that produces a new
conversation (an effect that returns an effect).

In the following reducer, we have the assistant summarize the current
conversation and then return a new effect which yields that summary in a user
message.

`summarize_reducer.ts`

<<< @/_blocks/summarize_reducer.ts

## Applying the Reducer

We can apply a reducer to the current conversation by piping into `L.reduce`.

<<< @/_blocks/summarize_reduce.ts
