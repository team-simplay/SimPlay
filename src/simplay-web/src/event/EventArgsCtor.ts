import { EventArgs } from './EventArgs';

// this eslint-disable is needed because the derived classes have different types for their args
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventArgsCtor<T extends EventArgs> = new (args: any) => T;
