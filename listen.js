import * as Effect from "effect/Effect";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import { Self } from "./liminal/L/Self.js";
/** Attach an event handler to process thread events. */
export const listen = Effect.fnUntraced(function* (f) {
    const latch = yield* Effect.makeLatch(false);
    const { events } = yield* Self;
    const dequeue = yield* events.subscribe;
    const fiber = yield* latch.open.pipe(Effect.zipRight(Stream.fromQueue(dequeue).pipe(Stream.runForEach(f), Effect.fork)));
    yield* latch.await;
    return fiber;
});
//# sourceMappingURL=listen.js.map