# Liminal Schemas <Badge type="warning" text="beta" />

We may want to specify type information in cases such as tool parameter and
structured output definition. In such cases, we can utilize existing runtime
type libraries such as `zod` and `arktype`.

## Type Adapter Installation

Import the `/register` augmentation from the package corresponding to your
runtime type library of choice.

For Zod, for example, we would do the following.

```ts
import "liminal-zod3/register"
```

## Type Adapters

| Library          | Adapter           |
| ---------------- | ----------------- |
| `zod` (v3)       | `liminal-zod3`    |
| `arktype`        | `liminal-arktype` |
| `valibot`        | `liminal-valibot` |
| `typebox`        | `liminal-typebox` |
| `liminal-effect` | `liminal-effect`  |

## Comparison with Standard Schema

## Creating a Type Adapter
