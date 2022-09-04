import { RandomItemPicker } from './RandomItemPicker'

describe('RandomItemPicker', () => {
    let picker: RandomItemPicker<number>
    const choices = Array.from({length: 100}, (_, i) => i)

    it.each(Array.from({length: 10}, () => Math.random()))('next', value => {
        const random = jest.fn((): number => {
            return value
        })
        picker = new RandomItemPicker(choices, random)
        const generated = picker.next()
        expect(generated).toBe(Math.floor(value * choices.length))
    })
    it('getExtremeValues', () => {
        picker = new RandomItemPicker(choices)
        const values = picker.getExtremeValues()
        expect(values).not.toBe(choices)
        expect(values).toEqual(choices)
    })
})
