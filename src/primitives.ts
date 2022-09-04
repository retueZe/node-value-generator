import { IValueGenerator, IRandomValueGenerator, Random, randomInteger } from './IValueGenerator'

export abstract class ValueGeneratorBase<T, A extends readonly unknown[] = readonly []> implements IValueGenerator<T, A> {
    abstract next(...args: A): T
    limit(...args: A): IValueGenerator<T> {
        return new LimitedValueGenerator(this, args)
    }
    iterate(...args: A): IterableIterator<T> {
        return new ValueGeneratorIterator(this, args)
    }
    take(count: number, ...args: A): T[] {
        count = Math.floor(count)

        if (count < 0) throw new Error('Count cannot be negtive.')

        const values = new Array<T>(count)

        for (let i = 0; i < count; i++)
            values[i] = this.next(...args)

        return values
    }
    abstract getExtremeValues(...args: A): T[]
    map<U>(mapper: (value: T) => U): IValueGenerator<U, A> {
        return new MappedValueGenerator(this, mapper)
    }
}
export class LimitedValueGenerator<T, A extends readonly unknown[] = readonly []> extends ValueGeneratorBase<T> {
    private readonly _source: IValueGenerator<T, A>
    private readonly _args: A

    constructor(source: IValueGenerator<T, A>, args: A) {
        super()
        this._source = source
        this._args = args
    }
    
    next(): T {
        return this._source.next(...this._args)
    }
    getExtremeValues(): T[] {
        return this._source.getExtremeValues(...this._args)
    }
}
export class ValueGeneratorIterator<T, A extends readonly unknown[] = readonly []> implements IterableIterator<T> {
    private readonly _next: () => T

    constructor(generator: IValueGenerator<T, A>, args: A) {
        this._next = () => generator.next(...args)
    }

    next(): IteratorResult<T> {
        return {done: false, value: this._next()}
    }
    [Symbol.iterator](): IterableIterator<T> {
        return this
    }
}
export class MappedValueGenerator<U, T, A extends readonly unknown[] = readonly []> extends ValueGeneratorBase<U, A> {
    private readonly _source: IValueGenerator<T, A>
    private readonly _mapper: (value: T) => U
    
    constructor(source: IValueGenerator<T, A>, mapper: (value: T) => U) {
        super()
        this._source = source
        this._mapper = mapper
    }

    next(...args: A): U {
        return this._mapper(this._source.next(...args))
    }
    getExtremeValues(...args: A): U[] {
        return this._source.getExtremeValues(...args).map(this._mapper)
    }
}
export abstract class RandomValueGeneratorBase<T, A extends readonly unknown[] = readonly []> extends ValueGeneratorBase<T, A> implements IRandomValueGenerator {
    readonly random: Random

    constructor(random?: Random | null) {
        super()
        this.random = random ?? Math.random
    }
}
export abstract class RandomContainerGeneratorBase<T, A extends readonly unknown[] = readonly []> extends RandomValueGeneratorBase<T, A> {
    readonly defaultMaxLength: number
    readonly defaultMinLength: number

    constructor(defaultMaxLength: number, defaultMinLength: number, random?: Random | null) {
        super(random)
        this.defaultMaxLength = Math.floor(defaultMaxLength)
        this.defaultMinLength = Math.floor(defaultMinLength)

        if (this.defaultMinLength - 0.5 > this.defaultMaxLength)
            throw new Error('Min length cannot be greather than ax length.')
    }

    protected nextLength(maxLength?: number | null, minLength?: number | null): number {
        maxLength ??= this.defaultMaxLength
        minLength ??= this.defaultMinLength

        if (minLength - 0.5 > maxLength) throw new Error('Min length cannot be greater than max length.')

        return randomInteger(maxLength, minLength, this.random)
    }
}
