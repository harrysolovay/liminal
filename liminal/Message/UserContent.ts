import type { FilePart, ImagePart, TextPart } from "./content_part.js"

export type UserContent = string | Array<TextPart | ImagePart | FilePart>
