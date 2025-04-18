// TODO: clean up this mostly-LLM-generated code.

import type { JSONSchema } from "./JSON/JSONSchema.ts"
import type { JSONSchemaRef } from "./JSON/JSONSchemaRef.ts"

export type SpecExt = { [k in `x-${string}`]?: unknown }

export interface TagObject extends SpecExt {
  /** The canonical tag identifier used in operation.tags */
  name: string
  /** Optional rich‑text description (CommonMark). */
  description?: string
  /** Optional link to more documentation about this tag. */
  externalDocs?: ExternalDocumentationObject
}

export interface OpenAPIObject extends SpecExt {
  openapi: string
  info: InfoObject
  jsonSchemaDialect?: string // NEW in 3.1
  servers?: ServerObject[]
  paths?: PathsObject
  webhooks?: WebhooksObject
  components?: ComponentsObject
  security?: SecurityRequirementObject[]
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
}

export interface InfoObject extends SpecExt {
  title: string
  summary?: string
  description?: string
  termsOfService?: string
  contact?: ContactObject
  license?: LicenseObject
  version: string
}

export interface ContactObject extends SpecExt {
  name?: string
  url?: string
  email?: string
}

export interface LicenseObject extends SpecExt {
  name: string
  identifier?: string
  url?: string
}

export interface ServerObject extends SpecExt {
  url: string
  description?: string
  variables?: Record<string, ServerVariableObject>
}

export interface ServerVariableObject extends SpecExt {
  enum?: string[]
  default: string
  description?: string
}

export type PathsObject = Record<string, PathItemObject> & SpecExt

export interface PathItemObject extends SpecExt {
  summary?: string
  description?: string
  get?: OperationObject
  put?: OperationObject
  post?: OperationObject
  delete?: OperationObject
  options?: OperationObject
  head?: OperationObject
  patch?: OperationObject
  trace?: OperationObject
  servers?: ServerObject[]
  parameters?: Array<ParameterObject>
}

export interface OperationObject extends SpecExt {
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: ExternalDocumentationObject
  operationId?: string
  parameters?: Array<ParameterObject>
  requestBody?: RequestBodyObject
  responses: ResponsesObject
  callbacks?: Record<string, CallbackObject>
  deprecated?: boolean
  security?: SecurityRequirementObject[]
  servers?: ServerObject[]
}

export interface ExternalDocumentationObject extends SpecExt {
  description?: string
  url: string
}

export interface ComponentsObject extends SpecExt {
  schemas?: Record<string, JSONSchema>
  responses?: Record<string, ResponseObject>
  parameters?: Record<string, ParameterObject>
  examples?: Record<string, ExampleObject>
  requestBodies?: Record<string, RequestBodyObject>
  headers?: Record<string, HeaderObject>
  securitySchemes?: Record<string, SecuritySchemeObject>
  links?: Record<string, LinkObject>
  callbacks?: Record<string, CallbackObject>
  pathItems?: Record<string, PathItemObject> // NEW in 3.1
}

export interface ParameterObject extends SpecExt {
  name: string
  in: "query" | "header" | "path" | "cookie"
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: string
  explode?: boolean
  allowReserved?: boolean
  schema?: JSONSchema
  example?: unknown
  examples?: Record<string, Ref<ExampleObject>>
  content?: Record<string, MediaTypeObject>
}

export interface RequestBodyObject extends SpecExt {
  description?: string
  content: Record<string, MediaTypeObject>
  required?: boolean
}

export type ResponsesObject = Record<string, ResponseObject> & { default?: ResponseObject } & SpecExt

export interface ResponseObject extends SpecExt {
  description: string
  headers?: Record<string, HeaderObject>
  content?: Record<string, MediaTypeObject>
  links?: Record<string, LinkObject>
}

export interface MediaTypeObject extends SpecExt {
  schema?: JSONSchema
  example?: unknown
  examples?: Record<string, ExampleObject>
  encoding?: Record<string, EncodingObject>
}

export interface EncodingObject extends SpecExt {
  contentType?: string
  headers?: Record<string, HeaderObject>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}

export interface ExampleObject extends SpecExt {
  summary?: string
  description?: string
  value?: unknown
  externalValue?: string
}

export interface HeaderObject extends Omit<ParameterObject, "name" | "in"> {}

export interface LinkObject extends SpecExt {
  operationRef?: string
  operationId?: string
  parameters?: Record<string, unknown>
  requestBody?: unknown
  description?: string
  server?: ServerObject
}

export type CallbackObject = Record<string, PathItemObject> & SpecExt

export type WebhooksObject = Record<string, PathItemObject> & SpecExt

export interface SecurityRequirementObject {
  [securitySchemeName: string]: string[]
}

export interface SecuritySchemeObject extends SpecExt {
  type: "apiKey" | "http" | "mutualTLS" | "oauth2" | "openIdConnect"
  description?: string
  // apiKey
  name?: string
  in?: "query" | "header" | "cookie"
  // http
  scheme?: string
  bearerFormat?: string
  // oauth2
  flows?: OAuthFlowsObject
  // openId
  openIdConnectUrl?: string
}

export interface OAuthFlowsObject extends SpecExt {
  implicit?: OAuthFlowObject
  password?: OAuthFlowObject
  clientCredentials?: OAuthFlowObject
  authorizationCode?: OAuthFlowObject
}

export interface OAuthFlowObject extends SpecExt {
  authorizationUrl?: string
  tokenUrl?: string
  refreshUrl?: string
  scopes: Record<string, string>
}
