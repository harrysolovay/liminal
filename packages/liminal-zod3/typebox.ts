// import { type Static, type TSchema } from "@sinclair/typebox"
// import { type SchemaRoot, validateSchemaRoot } from "liminal"
// import { _util } from "liminal"

// export function fromTypebox<B extends TSchema & { static: _util.JSONValueObject }>(
//   typeboxType: B,
// ): SchemaRoot<Static<B>> {
//   return {
//     ...validateSchemaRoot(typeboxType),
//     "~standard": typeboxType["~standard"] as never,
//   }
// }
