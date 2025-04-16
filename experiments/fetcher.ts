// import { BodyMixin, Dispatcher, type RequestDuplex } from "undici-types"
// import type { ChatRequest } from "./dest/ChatRequest.ts"

// type HeadersInit = string[][] | Record<string, string | ReadonlyArray<string>>

// interface TypedRequest<U extends string, M extends string> extends Request {
//   url: U
//   method: M
// }

// interface TypedResponse<U extends string, M extends string> extends Response {
//   url: U
//   method: M
// }

// declare const x: TypedRequest<"hello", "GET">

// const g = await fetch(x)
// g.url

// declare global {
//   function fetch<U extends string, M extends string>(
//     input: TypedRequest<U, M>,
//     init?: RequestInit,
//   ): Promise<TypedResponse<U, M>>
// }

// declare const TOKEN: string

// request.xai["/v1/chat/completions"].$post({
//   body: {
//     max_tokens,
//   },
// })

// declare const request: {
//   xai: {
//     "/v1/api-key": {
//       $url(): string
//       $get(
//         data: {
//           headers: {
//             Authentication: `Bearer ${string}`
//           }
//         },
//       ): Request
//     }
//     "/v1/chat/completions": {
//       $post(data: {
//         body: ChatRequest
//         headers: {
//           Authentication: `Bearer ${string}`
//         }
//       }): Request
//     }
//     "/v1/chat/deferred-completion/{request_id}": {
//       $get(data: {
//         param: { request_id: string }
//         headers: {
//           Authentication: `Bearer ${string}`
//         }
//       }): Request
//     }
//   }
// }

// api.xai["/v1/api-key"].$get({
//   headers: {
//     Authentication: "Bearer TODO",
//   },
// })

// type TypedRequestInit<M extends string, H extends HeadersInit> = {
//   method: M
//   keepalive?: boolean
//   body?: BodyInit | null
//   redirect?: RequestRedirect
//   integrity?: string
//   signal?: AbortSignal | null
//   credentials?: RequestCredentials
//   mode?: RequestMode
//   referrer?: string
//   referrerPolicy?: ReferrerPolicy
//   window?: null
//   dispatcher?: Dispatcher
//   duplex?: RequestDuplex
// } & ([keyof H] extends [never] ? { headers?: never } : { headers: H })

// async function fetcher() {
//   const result = await fetch("/v1/api-key", {
//     method: "GET",
//     headers: {
//       Authentication: `Bearer ${TOKEN}`,
//     },
//   })

//   switch (result.status) {
//     case 200: {
//       return JSON.parse(await result.json())
//     }
//     case 400: {
//       result.statusText
//       return ""
//     }
//   }
// }
