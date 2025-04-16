import type { Stream } from "../Rune/Stream.ts"
import type { Schema } from "../Schema.ts"
import type { LBase } from "./_LBase.ts"

export interface stream<T> extends LBase<Stream<T>, ReadableStream<T>> {}

export declare function stream<T = string>(schema?: Schema<T>): stream<T>
