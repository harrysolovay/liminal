# liminal

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
