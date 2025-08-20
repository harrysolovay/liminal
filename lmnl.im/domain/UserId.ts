import { Brand } from "effect"

export type UserId = string & Brand.Brand<"UserId">
export const UserId = Brand.nominal<UserId>()
