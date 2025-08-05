import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
// import { Auth } from "./middleware.ts"

export class Api extends HttpApi.make("api").add(
  HttpApiGroup
    .make("v1")
    .add(
      HttpApiEndpoint
        .post("sendMessage")`/send_message`
        .setPayload(Schema.Struct({
          message: Schema.String,
        }))
        .addSuccess(Schema.String),
    ),
  // .middleware(Auth),
) {}
