import { Random, randomInteger } from './IValueGenerator'
import { RandomValueGeneratorBase } from './primitives'

export type NumberGeneratorArgs = readonly [max?: number | null, min?: number | null, generateInteger?: boolean | null]
export class NumberGenerator extends RandomValueGeneratorBase<number, NumberGeneratorArgs> {
    static readonly DEFAULT: NumberGenerator
    /** @since 0.2.0 */
    readonly defaultMax: number
    /** @since 0.2.0 */
    readonly defaultMin: number
    /** @since 0.2.0 */
    readonly generatesIntegersByDefault: boolean
    
    constructor(random?: Random | null, ...args: NumberGeneratorArgs) {
        super(random)
        this.generatesIntegersByDefault = args[2] ?? false

        if (this.generatesIntegersByDefault) {
            this.defaultMax = Math.floor(args[0] ?? Number.MAX_SAFE_INTEGER)
            this.defaultMin = Math.floor(args[1] ?? Number.MIN_SAFE_INTEGER)
        } else {
            this.defaultMax = args[0] ?? Number.MAX_VALUE
            this.defaultMin = args[1] ?? Number.MIN_VALUE
        }

        if (this.defaultMax < this.defaultMin) throw new Error('Min cannot be greater than max.')
    }
    
    next(max?: number | null, min?: number | null, generateInteger?: boolean | null): number {
        generateInteger ??= this.generatesIntegersByDefault

        if (generateInteger == this.generatesIntegersByDefault) {
            max ??= this.defaultMax
            min ??= this.defaultMin
        } else {
            if (generateInteger) {
                max ??= Number.MAX_SAFE_INTEGER
                min ??= Number.MIN_SAFE_INTEGER
            } else {
                max ??= Number.MAX_VALUE
                min ??= Number.MIN_VALUE
            }
        }
        if (generateInteger) {
            max = Math.floor(max)
            min = Math.floor(min)

            return randomInteger(max, min, this.random)
        }
                
        return this.random() * (max - min) + min
    }
    nextInteger(max?: number | null, min?: number | null): number {
        return this.next(max, min, true)
    }
    getExtremeValues(max?: number | null, min?: number | null, generateInteger?: boolean | null): number[] {
        return generateInteger ?? false
            ? [max ?? Number.MAX_SAFE_INTEGER, min ?? Number.MIN_SAFE_INTEGER]
            : [max ?? Number.MAX_VALUE, min ?? Number.MIN_VALUE]
    }
}
(NumberGenerator as any).DEFAULT = new NumberGenerator()
