import { encodeBase32 } from "@std/encoding"
import type Openai from "openai"
import type { ChatModel } from "openai/resources/chat/chat"
import type {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions"
import { type Adapter, DEFAULT_INSTRUCTIONS } from "../../client/mod.ts"
import { type AnyType, JSONTypeName } from "../../core/mod.ts"
import { WeakMemo } from "../../util/mod.ts"
import { transform } from "../provider_common.ts"
import { unwrapCompletion, unwrapOutput } from "./openai_util.ts"
import { OpenAIResponseFormat } from "./OpenAIResponseFormat.ts"

export type OpenAIModel = (string & {}) | ChatModel

export interface OpenAIProvider {
  M: (string & {}) | ChatModel
  I: ChatCompletionMessageParam
  O: ChatCompletionMessage
  E: Omit<
    ChatCompletionCreateParamsBase,
    "function_call" | "messages" | "model" | "response_format" | "stream" | "tool_choice" | "tools"
  >
}

export function OpenAIAdapter({
  openai,
  defaultModel = "gpt-4o-mini",
  defaultInstruction = DEFAULT_INSTRUCTIONS,
}: {
  openai: Openai
  defaultModel?: OpenAIModel
  defaultInstruction?: string
}): Adapter<OpenAIProvider> {
  return {
    transform,
    formatInput: (content) => ({
      role: "user",
      content,
    }),
    unwrapOutput,
    complete: async ({ type, messages, model, options }) => {
      if (!messages || !messages.length) {
        messages = [{
          role: "system",
          content: defaultInstruction,
        }]
      }
      model ??= defaultModel
      if (JSONTypeName(type) === "string") {
        return openai.chat.completions.create({
          messages,
          model: model ?? defaultModel,
        }).then(unwrapCompletion)
      }
      const response_format = OpenAIResponseFormat(await signatureHashMemo.getOrInit(type), type)
      return openai.chat.completions
        .create({
          model,
          messages,
          response_format,
          ...options ?? {},
        })
        .then(unwrapCompletion)
    },
  }
}

const signatureHashMemo: WeakMemo<AnyType, Promise<string>> = new WeakMemo((type) =>
  crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(type.signature()))
    .then(encodeBase32)
    .then((v) => v.slice(0, -4))
)
