import { Random, randomInteger } from './IValueGenerator'
import { RandomContainerGeneratorBase } from './primitives'

export type StringGeneratorArgs = readonly [
    maxLength?: number | null,
    minLength?: number | null,
    charset?: ArrayLike<number> | null]
export class StringGenerator extends RandomContainerGeneratorBase<string, StringGeneratorArgs> {
    static readonly DEFAULT: StringGenerator
    static readonly DEFAULT_MAX_LENGTH = 50
    static readonly DEFAULT_MIN_LENGTH = 10
    static readonly DEFAULT_CHARSET = [
        Array.from({length: 26}, (_, i) => 'a'.charCodeAt(0) + i),
        Array.from({length: 26}, (_, i) => 'A'.charCodeAt(0) + i),
        Array.from({length: 10}, (_, i) => '0'.charCodeAt(0) + i),
        ['+', '/'].map(char => char.charCodeAt(0))
    ].flatMap(chunk => chunk)
    readonly defaultCharset: ArrayLike<number>

    constructor(random?: Random | null, ...defaultArgs: StringGeneratorArgs) {
        const defaultMaxLength = defaultArgs[0] ?? StringGenerator.DEFAULT_MAX_LENGTH
        const defaultMinLength = defaultArgs[1] ?? StringGenerator.DEFAULT_MIN_LENGTH
        super(defaultMaxLength, defaultMinLength, random)
        this.defaultCharset = defaultArgs[2] ?? StringGenerator.DEFAULT_CHARSET
    }

    next(maxLength?: number | null, minLength?: number | null, charset?: ArrayLike<number> | null): string {
        charset ??= this.defaultCharset
        const charCodes = Array.from(
            {length: this.nextLength(maxLength, minLength)},
            () => charset[randomInteger(charset.length - 1, 0)])

        return String.fromCharCode(...charCodes)
    }
    getExtremeValues(maxLength?: number | null, minLength?: number | null, charset?: ArrayLike<number> | null): string[] {
        charset ??= this.defaultCharset
        const lengths = [maxLength ?? this.defaultMaxLength, minLength ?? this.defaultMinLength]
        const charCodes = [charset[0], charset[charset.length - 1]]
        const values = new Array<string>(lengths.length * charCodes.length)

        for (let i = 0; i < lengths.length; i++)
        for (let j = 0; j < charCodes.length; j++)
            values[i * lengths.length + j] = String.fromCharCode(...Array.from(
                {length: lengths[i]},
                () => charCodes[j]))

        return values
    }
}
(StringGenerator as any).DEFAULT = new StringGenerator()
