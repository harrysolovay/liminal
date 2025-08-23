import * as Context from "effect/Context"
import { prefix } from "../util/prefix.ts"

export class prev extends Context.Tag(prefix("prev"))<prev, unknown>() {}
