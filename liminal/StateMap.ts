export class StateMap extends Map<StateConstructor, any> {}

export type StateConstructor = new() => any
