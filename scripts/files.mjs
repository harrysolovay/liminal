import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
export const rootDir = (path = ".") => resolve(fileURLToPath(import.meta.url), "../..", path);
