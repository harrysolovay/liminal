import { PgDrizzle } from "@effect/sql-drizzle/Pg";
import * as Effect from "effect/Effect";
import { listen } from "./liminal/L/listen.js";
import { Self } from "./liminal/L/Self.js";
// import { events } from "./events.ts"
// import { messages } from "./messages.ts"
export const relay = listen(Effect.fnUntraced(function* (event) {
    const { state: { fqn } } = yield* Self;
    const pg = yield* PgDrizzle;
    switch (event._tag) {
        case "system_set": {
            break;
        }
        case "messages_appended": {
            break;
        }
        case "messages_cleared": {
            break;
        }
    }
}));
//# sourceMappingURL=state.js.map