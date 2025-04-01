import type { FilePart, ImagePart, TextPart } from "../content_part.ts"

export type UserContent = string | Array<TextPart | ImagePart | FilePart>
