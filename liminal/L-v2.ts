import { L } from "./index.ts"
import { internal } from "./internal.ts"

// Flatten a union of objects into a single object
type Prettify<T> =
  & { [K in keyof T]: T[K] }
  & {}

interface UsageError<Message, Found = never> {}

/**
 * L.messages types, which can be mapped back into storage into a database
 * Access these types via L.Messages
 */
export namespace State {
  export type Messages = {
    assistant: State.AssistantMessage
    user: State.UserMessage
    system: State.SystemMessage
    tool: State.ToolMessage
    /** Liminal messages are transformed before being sent to the model and can have special effects on the model's behavior. */
    liminal: State.LiminalMessage
  }
  /** a union of all the messages */
  export type Message = Messages[keyof Messages]
  /** content field for {@link State.Message} types */
  export type MessageContentItem = {
    type: string // MIME type like "text/plain", "image/png", "application/pdf"
    content: {
      url?: string // URL to the content
      text?: string // UTF-8 text content
    }
    /** Additional properties that describe or contextualize the content.
     * For example: filename, size, dimensions, creation date, author, etc.
     */
    metadata?: Record<string, unknown>
  }

  export type AssistantToolCall = {
    id: string
    type: "function"
    function: {
      name: string
      arguments: string // JSON string
    }
  }

  /** Message from a user to the assistant */
  export type UserMessage = {
    role: "user"
    content: string | MessageContentItem[]
  }

  /** System message providing context or instructions */
  export type SystemMessage = {
    role: "system"
    content: string | MessageContentItem[]
  }

  /** Assistant message that may include content and tool calls */
  export type AssistantMessage = {
    role: "assistant"
    content: string | MessageContentItem[]
    /** Note: The API can stream both content chunks and tool_calls chunks in the same message, though they arrive in a specific order (content first, then tool calls). */
    tool_calls?: AssistantToolCall[]
  }

  /** Represents the response/result from a tool back to the model after the assistant has called it (referenced by tool_call_id), while a role: "assistant" message represents the model's own output, which may include both content and new tool calls. */
  export type ToolMessage = {
    role: "tool"
    tool_call_id: string
    /** If you need to return structured data, you should stringify it into the content field. This matches OpenAI's API behavior. */
    content: string | MessageContentItem[]
  }

  /** Declarations are places where a tool is mentioned to be included */
  export type LiminalMessage = {
    role: "liminal"
  }
}

/* reminder:

interface Generator<T = unknown, TReturn = any, TNext = any> extends IteratorObject<T, TReturn, TNext> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
}

*/

// helper type, where the second parameter is an action.
type LYields<T, Action = never> = Generator<Action, T, any>

/**
 * Direct manipulation of the current conversation's state, for advanced users.
 * Get messages for storage, set messages from storage, append messages, etc.
 *
 * It is highly recommended to only interact with the tail of the messages,
 * but if you must manipulate the list as a whole, there's an escape hatch with
 * {@link state.getAll} & {@link state.setAll}.
 */
export namespace state {
  /**
   * @example
   * const allMessages: L.State.Message[] = yield* L.state.getAllMessages();
   */
  export const getAll: () => LYields<State.Message[]> = internal.get

  /**
   * @example
   * // Remove all messages after a specific message
   * yield* L.state.removeAfter(someMessage);
   */
  export const removeAfter: (message: State.Message) => LYields<void> = internal.removeAfter

  /**
   * @example
   * // Remove a specific message
   * yield* L.state.remove(someMessage);
   */
  export const remove: (message: State.Message) => LYields<void> = internal.remove

  /**
   * @example
   * // Append new messages to the end
   * yield* L.state.append(newMessage1, newMessage2);
   */
  export const append: (...messages: State.Message[]) => LYields<void> = internal.append

  /**
   * @example
   * // Insert messages after a specific message
   * yield* L.state.insertAfter(someMessage, newMessage1, newMessage2);
   */
  export const insertAfter: (message: State.Message, ...messages: State.Message[]) => LYields<void> =
    internal.insertAfter

  /**
   * @example
   * // Insert messages before a specific message
   * yield* L.state.insertBefore(someMessage, newMessage1, newMessage2);
   */
  export const insertBefore: (message: State.Message, ...messages: State.Message[]) => LYields<void> =
    internal.insertBefore

  /**
   * @example
   * // Find last message matching a predicate
   * const lastUserMsg = yield* L.state.findLast(msg => msg.role === "user");
   */
  export const findLast: <T extends State.Message>(
    predicate: (message: State.Message) => message is T,
  ) => LYields<T | undefined> = internal.findLast

  /**
   * @example
   * // Replace all messages with a new array
   * yield* L.state.set([newMessage1, newMessage2]);
   */
  export const setAll: (messages: State.Message[]) => LYields<void> = internal.set

  /**
   * @example
   * // Clear all messages
   * yield* L.state.clear();
   */
  export const clear: () => LYields<void> = internal.clear
}

// Agent <- Executor

interface Tag<T> {
  "~": T
  template: TemplateStringsArray
  substitutions: Array<string>
}

function tag<T = unknown>(
  template: TemplateStringsArray,
  ...substitutions: Array<string>
): Tag<T> {
  return {
    template,
    substitutions,
    get "~"(): never {
      throw new Error("Cannot access ~ from a description")
    },
  }
}

type TagRecordValues<T extends Record<string, Tag<any>>> = Prettify<
  { [K in keyof T]: T[K]["~"] }
>

/**
 * @example
 * // Request a database connection with specific capabilities
 * const primary = yield* L.require({
 *   primary: L.tag<Database>`A transactional database for user data and core business logic`
 * })
 *
 * // Request another database connection separately
 * const analytics = yield* L.require({
 *   analytics: L.tag<Database>`A columnar database optimized for analytical queries`
 * })
 *
 * @example
 * // Request specific language models with capabilities
 * // The description is for error messages that may appear in the CLI.
 * const fast = yield* L.require({
 *   fast: L.tag<LanguageModel>`A model that goes fast, is cheap, but has a short context window`,
 * })
 */
export const require: <T extends Record<string, Tag<any>>>(
  tags: T,
) => OneKey<T> extends never ? UsageError<"Must require only one key at a time", { keys: keyof T }>
  : LYields<TagRecordValues<T>[keyof T]> = internal.require

type OneKey<T extends Record<string, unknown>> = Values<{ [P in keyof T as keyof T extends P ? P : never]: T[P] }>
type Values<T extends Record<string, unknown>> = T[keyof T]

const expectType = <T>(value: T) => value
const expectNever = <_ extends never>() => void 0
expectType<OneKey<{ a: 1 }>>(1)
expectNever<OneKey<{ a: 1; b: 2 }>>()
expectNever<OneKey<{ fast: Tag<{}>; slow: Tag<{}> }>>()
expectNever<OneKey<{ fast: Tag<{}>; slow: Tag<{ a: 1 }> }>>()

class AILanguageModel {}

function* agent() {
  const value: AILanguageModel = yield* require({ fast: tag<AILanguageModel>`hello` })
  // @ts-expect-error
  const error = yield* require({ fast: tag<1>`hello`, slow: tag<2>`hello` })
}
