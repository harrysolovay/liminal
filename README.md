# Liminal

> Primitives for LLM tool-calling and context management.

- [llms.txt &rarr;](./llms.txt)<br />Chunks of truth to be fed into LLMs.
- [Awesome &rarr;](./AWESOME.md)<br />An awesome list from the open source
  community
- [Examples &rarr;](https://liminal.land/examples)<br />Examples illustrating
  common use cases.

## Why?

- Establish a TypeScript-centric way to define reusable flows without getting
  locked into specific LLM providers or client libraries
- Inject model upon flow execution. This means that we can share flow libraries
  without being bound to a specific LLM
- Attaching descriptions to schemas / virtual types that cater better to the LLM
  use case
- Allow tools to specify requirements – type-safe
- Eliminating completion API boilerplate
- Keeping model selection decoupled from flows.
- Abstracting away direct management of context buffers
- Observability within complex flows

## Other Perks

- Handles dedent-ing

---

## **Code of Conduct**

Please ensure you adhere to our [code of conduct](CODE_OF_CONDUCT.md) when
interacting in this repository.

---

## **Contributing**

Contributions are welcome and appreciated! Check out the
[contributing guide](CONTRIBUTING.md) before you dive in.

---

## **License**

Liminal is [Apache-licensed](LICENSE).
