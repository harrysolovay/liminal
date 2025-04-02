# Scope

A `Scope` represents the state with which a conversation is executed. It tracks
the underlying message buffer, events subtree, enabled tools, and child scopes,
allowing for hierarchical conversation structures.

Each conversation runs within its own scope, ensuring that message history and
tools remain isolated from other conversations. This isolation means changes in
one scope (like enabling a new tool) don't affect other scopes.

There are three actions that result in new scopes:

- `Context`: When creating a new `Context`, a single new scope is created to
  underlay the context generator.
- `Fork`: When forking, new scopes are created for the fork arm(s).
- `Tool`: When tools are called by the underlying model, the tool implementation
  may return an actor, in which case a new context will be created for that tool
  actor.

For example:

```ts
function* MainConversation() {
  // This runs in the main scope.
  yield* user`What's the weather?`

  // Fork the conversation into two, each with their own isolated copy of the current scope.
  yield* Fork({
    *sunny() {
      // This runs in a new isolated scope.
      yield* user`It's sunny!`
    },
    *rainy() {
      // This runs in a new isolated scope as well.
      yield* user`It's raining!`
    },
  })
}
```

Child scopes always inherit the parent's models. However, only in the case of
forking do child scopes inherit state such as messages and toolboxes. Subsequent
changes after creation remain isolated within each scope.
