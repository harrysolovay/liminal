---
"liminal": minor
---

Rename `L.assistantStruct` to `L.assistantSchema`, is it now supports all schemas, not just struct schemas. Template tag calls are properly dedented and normalized. Additionally, `L.userJson` now uses the optional schema to JSONC-encode with description annotations as comments on corresponding fields.
