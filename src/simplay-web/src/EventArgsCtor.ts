import { EventArgs } from "./EventArgs";

export type EventArgsCtor<T extends EventArgs> = new (args: any) => T;
