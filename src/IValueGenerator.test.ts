import { randomInteger } from './IValueGenerator'

describe('randomInteger', () => {
    it.each(Array.from({length: 10}, () => []))('randomInteger', () => {
        let generatedNumber: number
        const random = jest.fn((): number => {
            return generatedNumber = Math.random()
        })
        const max = 50, min = 10
        const generatedInteger = randomInteger(max, min, random)
        expect(random).toHaveBeenCalled()
        expect(generatedInteger).toBe(Math.floor(generatedNumber! * (max - min + 1) + min))
    })
    it('max < min', () => {
        expect(() => randomInteger(10, 50)).toThrow()
    })
    it.each(Array.from({length: 5}, () => [undefined, null]).flatMap(a => a))('random is null or undefined', (random) => {
        const value = 10
        expect(randomInteger(value, value, random)).toBe(value)
    })
})
