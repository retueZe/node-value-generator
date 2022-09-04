import { IValueGenerator, Random } from './IValueGenerator'
import { RandomContainerGeneratorBase } from './primitives'
import { RandomItemPicker } from './RandomItemPicker'
import { StringGenerator } from './StringGenerator'

export type ObjectGeneratorArgs = [maxPropertyCount?: number | null, minPropertyCount?: number | null]
export class ObjectGenerator<T> extends RandomContainerGeneratorBase<Record<string, T>, ObjectGeneratorArgs> {
    static readonly DEFAULT_PROPERTY_NAME_GENERATOR = new StringGenerator(null, null, null, [
        Array.from({length: 26}, (_, i) => 'a'.charCodeAt(0) + i),
        Array.from({length: 26}, (_, i) => 'A'.charCodeAt(0) + i)
    ].flatMap(chunk => chunk))
    static readonly DEFAULT_MAX_PROPERTY_COUNT = 50
    static readonly DEFAULT_MIN_PROPERTY_COUNT = 10
    readonly propertyNameGenerator: IValueGenerator<string>
    readonly defaultMaxPropertyCount: number
    readonly defaultMinPropertyCount: number

    constructor(
        readonly propertyValueGenerator: IValueGenerator<T, [name: string]>,
        propertyNameGenerationObject?: IValueGenerator<string> | ArrayLike<string> | null,
        random?: Random | null,
        ...defaultArgs: ObjectGeneratorArgs
    ) {
        let defaultMaxPropertyCount: number
        let defaultMinPropertyCount: number
        
        if (typeof propertyNameGenerationObject !== 'undefined' && 'length' in propertyNameGenerationObject) {
            defaultMaxPropertyCount = defaultArgs[0] ?? propertyNameGenerationObject.length
            defaultMinPropertyCount = defaultArgs[1] ?? propertyNameGenerationObject.length
        } else {
            defaultMaxPropertyCount = defaultArgs[0] ?? ObjectGenerator.DEFAULT_MAX_PROPERTY_COUNT
            defaultMinPropertyCount = defaultArgs[1] ?? ObjectGenerator.DEFAULT_MIN_PROPERTY_COUNT
        }

        super(defaultMaxPropertyCount, defaultMinPropertyCount, random)

        this.propertyNameGenerator = typeof propertyNameGenerationObject === 'undefined'
            ? ObjectGenerator.DEFAULT_PROPERTY_NAME_GENERATOR
            : 'length' in propertyNameGenerationObject
                ? new RandomItemPicker(propertyNameGenerationObject, this.random)
                : propertyNameGenerationObject
        this.defaultMaxPropertyCount = defaultMaxPropertyCount
        this.defaultMinPropertyCount = defaultMinPropertyCount
    }

    next(maxPropertyCount?: number | null, minPropertyCount?: number | null): Record<string, T> {
        const desiredPropertyCount = this.nextLength(maxPropertyCount, minPropertyCount)
        const object: Record<string, T> = {}
        let propertyCount = 0

        while (propertyCount - 0.5 < desiredPropertyCount) {
            const propertyName = this.propertyNameGenerator.next()

            if (object.hasOwnProperty(propertyName)) continue

            object[propertyName] = this.propertyValueGenerator.next(propertyName)
            propertyCount++
        }

        return object
    }
    getExtremeValues(): Record<string, T>[] {
        const data = this.propertyNameGenerator.getExtremeValues().map(name => ({
            name: name,
            values: this.propertyValueGenerator.getExtremeValues(name),
            divisor: 0
        }))
        let divisor = 1
        
        for (let i = 0; i < data.length; i++) {
            data[i].divisor = divisor
            divisor *= data[i].values.length
        }

        const values = new Array<Record<string, T>>(divisor)

        for (let i = 0; i < divisor; i++) {
            const value: Record<string, T> = {}
            values[i] = value

            for (let j = 0; j < data.length; j++) {
                const index = Math.floor(i / data[j].divisor) % data[j].values.length
                value[data[j].name] = data[j].values[index]
            }
        }

        return values
    }
}
