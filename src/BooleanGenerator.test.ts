import { BooleanGenerator } from './BooleanGenerator'

describe('BooleanGenerator', () => {
    let generator: BooleanGenerator

    it.each(Array.from({length: 20}, () => Math.random()))('next', value => {
        const random = jest.fn((): number => {
            return value
        })
        generator = new BooleanGenerator(random)
        const generated = generator.next()
        expect(generated).toBe(Math.floor(value * 2) !== 0)
    })
    it('getExtremeValues', () => {
        generator = BooleanGenerator.DEFAULT
        const values = generator.getExtremeValues()
        expect(values).toEqual([true, false])
    })
})
