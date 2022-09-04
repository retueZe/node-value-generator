import { Random, randomInteger } from './IValueGenerator'
import { RandomValueGeneratorBase } from './primitives'

export type NumberGeneratorArgs = readonly [max?: number | null, min?: number | null, generateInteger?: boolean | null]
export class NumberGenerator extends RandomValueGeneratorBase<number, NumberGeneratorArgs> {
    static readonly DEFAULT: NumberGenerator
    
    constructor(random?: Random | null) {
        super(random)
    }
    
    next(max?: number | null, min?: number | null, generateInteger?: boolean | null): number {
        generateInteger ??= false

        if (generateInteger) {
            max ??= Number.MAX_SAFE_INTEGER
            min ??= Number.MIN_SAFE_INTEGER
            
            return randomInteger(max, min, this.random)
        } else {
            max ??= Number.MAX_VALUE
            min ??= Number.MIN_VALUE
            
            return this.random() * (max - min) + min
        }
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
