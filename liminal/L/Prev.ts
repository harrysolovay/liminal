import * as Context from "effect/Context"
import { prefix } from "../util/prefix.ts"

export class Prev extends Context.Tag(prefix("Prev"))<Prev, unknown>() {}
