export type Maybe<T> = NonNullable<T> | null;

export const just = <T>(value: NonNullable<T>): Maybe<T> => value;
export const nothing = <T>(): Maybe<T> => null;
