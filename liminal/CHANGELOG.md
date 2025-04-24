# liminal

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
