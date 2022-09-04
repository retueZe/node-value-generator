import { IValueGenerator, Random, randomInteger } from './IValueGenerator'
import { RandomValueGeneratorBase } from './primitives'

export class BooleanGenerator extends RandomValueGeneratorBase<boolean> implements IValueGenerator<boolean> {
    static readonly DEFAULT: BooleanGenerator
    
    constructor(random?: Random | null) {
        super(random)
    }

    next(): boolean {
        return randomInteger(1, 0, this.random) !== 0
    }
    getExtremeValues(): boolean[] {
        return [true, false]
    }
}
(BooleanGenerator as any).DEFAULT = new BooleanGenerator()
