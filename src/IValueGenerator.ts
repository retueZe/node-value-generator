export interface IValueGenerator<T, A extends readonly unknown[] = readonly []> {
    next(...args: A): T
    limit(...args: A): IValueGenerator<T>
    iterate(...args: A): IterableIterator<T>
    take(count: number, ...args: A): T[]
    getExtremeValues(...args: A): T[]
    map<U>(mapper: (value: T) => U): IValueGenerator<U, A>
}
export interface IValueGeneratorProvider<M> extends IValueGenerator<M[keyof M]> {
    provide<K extends keyof M>(key: K): IValueGenerator<M[K]>
}
/** Signature of the {@link Math.random} function. */
export type Random = () => number
export interface IRandomValueGenerator {
    readonly random: Random
}

/** Generates a random integer in the `[min;max]` inverval. */
export function randomInteger(max: number, min: number, random?: Random | null) {
    if (max < min) throw new Error('Min cannot be greater than max.')

    random ??= Math.random

    return Math.floor(random() * (max - min + 1) + min)
}
