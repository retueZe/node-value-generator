import { Random, randomInteger } from './IValueGenerator'
import { LimitedValueGenerator, MappedValueGenerator, RandomContainerGeneratorBase, ValueGeneratorIterator } from './primitives'

class ValueGeneratorMock extends RandomContainerGeneratorBase<string, [postfix?: number]> {
    static readonly DEFAULT_MAX_LENGTH = 50
    static readonly DEFAULT_MIN_LENGTH = 10
    readonly generated: string[]

    constructor(maxLength?: number | null, minLength?: number | null, random?: Random | null) {
        super(
            maxLength ?? ValueGeneratorMock.DEFAULT_MAX_LENGTH,
            minLength ?? ValueGeneratorMock.DEFAULT_MIN_LENGTH,
            random)
        this.generated = []
    }

    next(postfix?: number): string {
        const value = `${this.generated.length} ${postfix ?? 0}`
        this.generated.push(value)

        return value
    }
    nextLength(maxLength?: number | null, minLength?: number | null): number {
        return super.nextLength(maxLength, minLength)
    }
    getExtremeValues(postfix?: number): string[] {
        return [`0 ${postfix}`]
    }
}

let generator: ValueGeneratorMock
const random = jest.fn()
const postfixes = Array.from({length: 10}, () => randomInteger(50, 10))

beforeEach(() => {
    generator = new ValueGeneratorMock(null, null, random)
})
describe.each(postfixes)('ValueGeneratorBase', postfix => {
    it('limit', () => {
        const limited = generator.limit(postfix)
        expect(limited).toBeInstanceOf(LimitedValueGenerator)
        const generated = limited.next()
        expect([generated]).toEqual(generator.generated)
    })
    it('iterate', () => {
        const iterator = generator.iterate(postfix)
        expect(iterator).toBeInstanceOf(ValueGeneratorIterator)
        const generated = new Array<string>(10)

        for (let i = 0; i < generated.length; i++)
            generated[i] = iterator.next().value

        expect(generated).toEqual(generator.generated)
    })
    describe('take', () => {
        it('count >= 0', () => {
            const taken = generator.take(10, postfix)
            expect(taken).toEqual(generator.generated)
        })
        it('count < 0', () => {
            expect(() => generator.take(-1)).toThrow()
        })
    })
    it('map', () => {
        const mapper = (value: string): string => value.replace(' ', '!')
        const mapped = generator.map(mapper)
        expect(mapped.take(10, postfix)).toEqual(generator.generated.map(mapper))
    })
})
describe.each(postfixes)('LimitedValueGenerator', postfix => {
    let limited: LimitedValueGenerator<string, [postfix?: number]>

    beforeEach(() => {
        limited = new LimitedValueGenerator(generator, [postfix])
    })
    it('next', () => {
        const generated = limited.next()
        expect([generated]).toEqual(generator.generated)
    })
    it('getExtremeValues', () => {
        const extremeValues = limited.getExtremeValues()
        expect(extremeValues).toEqual(generator.getExtremeValues(postfix))
    })
})
describe.each(postfixes)('ValueGeneratorIterator', postfix => {
    let iterator: ValueGeneratorIterator<string, [postfix?: number]>

    beforeEach(() => {
        iterator = new ValueGeneratorIterator(generator, [postfix])
    })
    it('next', () => {
        expect([iterator.next().value]).toEqual(generator.generated)
    })
    it('[Symbol.iterator]', () => {
        expect(iterator[Symbol.iterator]()).toBe(iterator)
    })
})
describe.each(postfixes)('MappedValueGenerator', postfix => {
    const mapper = (value: string): string => value.replace(' ', '!')
    let mapped: MappedValueGenerator<string, string, [postfix?: number]>

    beforeEach(() => {
        mapped = new MappedValueGenerator(generator, mapper)
    })
    it('next', () => {
        expect([mapped.next(postfix)]).toEqual(generator.generated.map(mapper))
    })
    it('getExtremeValues', () => {
        expect(mapped.getExtremeValues(postfix)).toEqual(generator.getExtremeValues(postfix).map(mapper))
    })
})
describe('RandomValueGeneratorBase', () => {
    let expectedRandom: Random

    it('random is mock', () => {
        expectedRandom = random
        expect(random).not.toHaveBeenCalled()
    })
    it.each([null, undefined])('random is null or undefined', random => {
        generator = new ValueGeneratorMock(null, null, random)
        expectedRandom = Math.random
    })
    afterEach(() => {
        expect(generator.random).toBe(expectedRandom)
    })
})
describe.each(Array.from({length: 10}, () => {
    const minLength = randomInteger(15, 5)
    const maxLength = minLength + randomInteger(30, 20)
    const randomNumber = Math.random()
    const random = () => randomNumber

    return [maxLength, minLength, random] as [number, number, () => number]
}).concat([[10, 10, () => 0.5]]))('RandomContainerGeneratorBase', (maxLength, minLength, random) => {
    beforeEach(() => {
        generator = new ValueGeneratorMock(maxLength, minLength, random)
    })
    describe('constructor', () => {
        it('defaultMaxLength >= defaultMinLength', () => {
            expect(generator.defaultMaxLength).toBe(maxLength)
            expect(generator.defaultMinLength).toBe(minLength)
            expect(generator.random).toBe(random)
        })
        it('defaultMaxLength < defaultMinLength', () => {
            expect(() => new ValueGeneratorMock(10, 50)).toThrow()
        })
    })
    describe('nextLength', () => {
        it.each([[null, null], [undefined, undefined], [maxLength, minLength]])('maxLength >= minLength', (...args) => {
            expect(generator.nextLength(...args))
                .toBe(Math.floor(random() * (maxLength - minLength + 1) + minLength))
        })
        it('maxLength < minLength', () => {
            expect(() => generator.nextLength(10, 50)).toThrow()
        })
    })
})
