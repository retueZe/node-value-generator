import { Random, randomInteger } from './IValueGenerator'
import { RandomValueGeneratorBase } from './primitives'

export class RandomItemPicker<T> extends RandomValueGeneratorBase<T> {
    constructor(readonly choices: ArrayLike<T>, random?: Random | null) {
        super(random)
    }

    next(): T {
        return this.choices[randomInteger(this.choices.length - 1, 0, this.random)]
    }
    getExtremeValues(): T[] {
        return Array.from(this.choices)
    }
}
