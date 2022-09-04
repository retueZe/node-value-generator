import { IValueGenerator, Random, randomInteger } from './IValueGenerator'
import { RandomContainerGeneratorBase } from './primitives'

export type ArrayGeneratorArgs<A extends readonly unknown[] = readonly []> = [
    maxLength?: number | null,
    minLength?: number | null,
    ...innerArgs: A
]
export class ArrayGenerator<T, A extends readonly unknown[] = readonly []> extends RandomContainerGeneratorBase<T[], ArrayGeneratorArgs<A>> {
    static readonly DEFAULT_MAX_LENGTH = 50
    static readonly DEFAULT_MIN_LENGTH = 10
    readonly defaultInnerArgs: A

    constructor(
        readonly itemGenerator: IValueGenerator<T, A>,
        random?: Random | null,
        maxLength?: number | null,
        minLength?: number | null,
        ...innerArgs: A
    ) {
        const defaultMaxLength = maxLength ?? ArrayGenerator.DEFAULT_MAX_LENGTH
        const defaultMinLength = minLength ?? ArrayGenerator.DEFAULT_MIN_LENGTH
        super(defaultMaxLength, defaultMinLength, random)
        this.defaultInnerArgs = innerArgs
    }

    private _adaptArgs(args: A): A {
        const adaptedArgs = new Array<unknown>(Math.max(args.length, this.defaultInnerArgs.length))
        
        for (let i = 0; i < args.length; i++)
            adaptedArgs[i] = args[i]
        for (let i = adaptedArgs.length; i < this.defaultInnerArgs.length; i++)
            adaptedArgs[i] = this.defaultInnerArgs[i]

        return adaptedArgs as any
    }
    next(maxLength?: number | null, minLength?: number | null, ...args: A): T[] {
        const adaptedArgs = this._adaptArgs(args)
        const array = Array.from(
            {length: this.nextLength(maxLength, minLength)},
            () => this.itemGenerator.next(...adaptedArgs))

        return array
    }
    getExtremeValues(maxLength?: number | null, minLength?: number | null, ...args: A): T[][] {
        maxLength ??= this.defaultMaxLength
        minLength ??= this.defaultMinLength
        const adaptedArgs = this._adaptArgs(args)

        return this.itemGenerator
            .getExtremeValues(...adaptedArgs)
            .flatMap(value => [
                Array.from({length: maxLength}, () => value),
                Array.from({length: minLength}, () => value)
            ])
    }
}
