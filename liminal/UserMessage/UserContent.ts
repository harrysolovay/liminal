import type { FilePart, ImagePart, TextPart } from "../Message/content_part.ts"

export type UserContent = string | Array<TextPart | ImagePart | FilePart>
