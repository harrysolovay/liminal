# TODO

- why?: common message format
- unwrapping nested `ActorLike`s?
- aborting/early exit + event
- branch event cleanup
- DI
- streaming
- tool-calling
- `Type extends Iterable<Generation<T>, T>`
- encodeDescriptions?: boolean // TODO: re-encode generated objects as JSONC
  with schema field descriptions commented above values
- provider-specific adapters:
  - ollama
  - anthropic
  - openai
  - xai
  - gemini
- Server Wrappers + Deployment Guides
  - cloudflare workers
  - supabase functions
  - vercel
  - hono
  - netlify
  - express
  - oak
  - fastify
  - lambda
  - deno deploy
- vscode extension for code lens / smart labels for different actions pins to
  enable referencing other types. The final description has a preface that
  describes any pinned types, and then have a common type ID for the given field
  description.
