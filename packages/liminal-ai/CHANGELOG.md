# liminal-ai

## 0.0.15

### Patch Changes

- 6e70190: Renaming Model to Adapter and L.model to L.focus
- Updated dependencies [6e70190]
  - liminal@0.5.16

## 0.0.14

### Patch Changes

- d12049c: Fix L.run return type. Add L.<type> for JSON-schema building.
- Updated dependencies [d12049c]
  - liminal@0.5.14

## 0.0.13

### Patch Changes

- bbd0e74: Liminal schema and util now exist within the liminal package itself. Runtime type compatibility changes.
- Updated dependencies [bbd0e74]
  - liminal@0.5.13

## 0.0.12

### Patch Changes

- Updated dependencies [4808a57]
  - liminal-util@0.0.7
  - liminal@0.5.12

## 0.0.11

### Patch Changes

- cf42ed2: Agent -> Strand. Making the API more uniform. Ie. Agent -> L.strand. L.branch -> L.strand.
- Updated dependencies [cf42ed2]
  - liminal@0.5.11
  - liminal-util@0.0.6

## 0.0.10

### Patch Changes

- ff92241: Fixed serialization error

## 0.0.9

### Patch Changes

- aef5564: Update Model interface to support streaming. Improve event-related functionality and emit fiber-related events.
- Updated dependencies [aef5564]
  - liminal-util@0.0.5
  - liminal@0.5.10

## 0.0.8

### Patch Changes

- dbd5e93: Reintroduced tools and various examples.
- Updated dependencies [dbd5e93]
  - liminal@0.5.9

## 0.0.7

### Patch Changes

- 23a24ae: Reintroduce L.catch and clean up parts of the generator runtime.
- f2f360c: Continue to clean up the generator runtime internals.
- Updated dependencies [23a24ae]
- Updated dependencies [f2f360c]
  - liminal@0.5.8
  - liminal-util@0.0.4

## 0.0.6

### Patch Changes

- 43afd27: Fixing misc. bugs and refactoring context management.
- Updated dependencies [43afd27]
  - liminal@0.5.5

## 0.0.5

### Patch Changes

- 284adab: Reintroduce AI SDK adapter and begin simplifying runic execution.
- Updated dependencies [284adab]
  - liminal@0.5.4

## 0.0.4

### Patch Changes

- 2d3a717: Complete rewrite of Liminal. Includes new packages for various integrations.
- Updated dependencies [2d3a717]
  - liminal@0.5.3

## 0.0.3

### Patch Changes

- de74823: Various API changes, such as infer as a callable object (the object of which implements Symbol.iterator and yields the actual action). Introduced initial "section" action. Also created an adapter for Ollama.
- Updated dependencies [de74823]
  - liminal@0.5.2

## 0.0.2

### Patch Changes

- 96339de: Fixing continuous publishing. No other changes contained in this release.
- Updated dependencies [96339de]
  - liminal@0.5.1

## 0.0.1

### Patch Changes

- 171acfe: Initial publish of Liminal and the Vercel AI adapter library. Still heavily WIP.
  More publishes to come!
- Updated dependencies [171acfe]
  - liminal@0.1.1
