export {}

// import * as Schema from "effect/Schema"
// import defer * as Conversant from "./Entity.ts"
// import { prefix } from "./util/prefix.ts"

// export const RelationTypeId: unique symbol = Symbol.for(prefix("RelationId"))

// export type RelationId = typeof RelationId.Type
// export const RelationId = Schema.String.pipe(Schema.brand(RelationTypeId))

// export interface Relation {
//   readonly id: RelationId
//   readonly target: Conversant.EntityState
// }

// export declare namespace Relation {
//   export interface Encoded {
//     readonly id: string
//     readonly target: Conversant.EntityState.Encoded
//   }
// }

// export class Relation extends Schema.Class<Relation>(prefix("Relation"))({
//   id: RelationId,
//   target: Schema.suspend((): Schema.Schema<Conversant.EntityState, Conversant.EntityState.Encoded> =>
//     Conversant.EntityState
//   ),
// }) {}
