# liminal

## 0.17.0

### Minor Changes

- 8212083: Refactor L.sequence -> L.line. Decouple thread effects from the providing of effects via L.provide.

## 0.16.0

### Minor Changes

- 2e96076: Refactoring "strands" into "threads", which can provide a handle with which to operate on the thread context outside of the thread's sequencers arguments.

## 0.15.0

### Minor Changes

- 3b4ec1a: - Instead of providing `AiToolkit` to `L.enable`/`L.disable`, we now provide tools directly.
  - Also includes the beginnings of a `coalesceModels` pattern.

## 0.14.0

### Minor Changes

- e7006b7: Implement tool enablement and disablement.

## 0.13.0

### Minor Changes

- 0e4954e: Rename `L.assistantStruct` to `L.assistantSchema`, is it now supports all schemas, not just struct schemas. Template tag calls are properly dedented and normalized. Additionally, `L.userJson` now uses the optional schema to JSONC-encode with description annotations as comments on corresponding fields.

## 0.12.1

### Patch Changes

- 6df720c: Fix NPM publish.

## 0.12.0

### Minor Changes

- a04ae8b: Introduce L.handle / rework strand event-handling mechanism.

## 0.11.1

### Patch Changes

- feee30f: Testing provenance capture in changeset-driven publishes.

## 0.11.0

### Minor Changes

- 48aa187: Rework mechanism of denoting strand boundary.

## 0.10.0

### Minor Changes

- 866e64a: Redesigning much of the API.

## 0.9.0

### Minor Changes

- df8861a: Separate L.assistant into L.assistantText and L.assistantStruct.

## 0.8.0

### Minor Changes

- bf980fb: Major redesign of the Liminal API to be more effect-idiomatic.

## 0.7.0

### Minor Changes

- d6fe173: Remove approach to passing handlers to strands.

## 0.6.0

### Minor Changes

- e88b9af: Rewrite using Effect-TS.

## 0.5.17

### Patch Changes

- 5c421c8: Re-add string dedenting for template-fn-style usage of user, system and schema.

## 0.5.16

### Patch Changes

- 6e70190: Renaming Model to Adapter and L.model to L.focus

## 0.5.15

### Patch Changes

- 9c276c3: Fix message list cloning, add streaming to ollama adapter.

## 0.5.14

### Patch Changes

- d12049c: Fix L.run return type. Add L.<type> for JSON-schema building.

## 0.5.13

### Patch Changes

- bbd0e74: Liminal schema and util now exist within the liminal package itself. Runtime type compatibility changes.

## 0.5.12

### Patch Changes

- 4808a57: Fix handling of standalone iterables supplied to L.strand. Also introduce strandard, a standard library of strands.
- Updated dependencies [4808a57]
  - liminal-util@0.0.7

## 0.5.11

### Patch Changes

- cf42ed2: Agent -> Strand. Making the API more uniform. Ie. Agent -> L.strand. L.branch -> L.strand.
- Updated dependencies [cf42ed2]
  - liminal-schema@0.0.5
  - liminal-util@0.0.6

## 0.5.10

### Patch Changes

- aef5564: Update Model interface to support streaming. Improve event-related functionality and emit fiber-related events.
- Updated dependencies [aef5564]
  - liminal-schema@0.0.4
  - liminal-util@0.0.5

## 0.5.9

### Patch Changes

- dbd5e93: Reintroduced tools and various examples.

## 0.5.8

### Patch Changes

- 23a24ae: Reintroduce L.catch and clean up parts of the generator runtime.
- f2f360c: Continue to clean up the generator runtime internals.
- Updated dependencies [23a24ae]
- Updated dependencies [f2f360c]
  - liminal-schema@0.0.3
  - liminal-util@0.0.4

## 0.5.7

### Patch Changes

- a56f121: Re-flatten events. Make fiber info available in event handler via this.
- Updated dependencies [a56f121]
  - liminal-util@0.0.3

## 0.5.6

### Patch Changes

- f79205e: Include fiber information in the event type supplied to user-specified handlers. Continue reworking runtime implementation.

## 0.5.5

### Patch Changes

- 43afd27: Fixing misc. bugs and refactoring context management.

## 0.5.4

### Patch Changes

- 284adab: Reintroduce AI SDK adapter and begin simplifying runic execution.
- Updated dependencies [284adab]
  - liminal-schema@0.0.2
  - liminal-util@0.0.2

## 0.5.3

### Patch Changes

- 2d3a717: Complete rewrite of Liminal. Includes new packages for various integrations.
- Updated dependencies [2d3a717]
- Updated dependencies [ff04b9f]
  - liminal-schema@0.0.1
  - liminal-util@0.0.1

## 0.5.2

### Patch Changes

- de74823: Various API changes, such as infer as a callable object (the object of which implements Symbol.iterator and yields the actual action). Introduced initial "section" action. Also created an adapter for Ollama.

## 0.5.1

### Patch Changes

- 96339de: Fixing continuous publishing. No other changes contained in this release.

## 0.1.1

### Patch Changes

- 171acfe: Initial publish of Liminal and the Vercel AI adapter library. Still heavily WIP.
  More publishes to come!
