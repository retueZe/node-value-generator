import { ArrayGenerator } from './ArrayGenerator'
import { BooleanGenerator } from './BooleanGenerator'
import { IValueGenerator, IValueGeneratorProvider, Random, randomInteger } from './IValueGenerator'
import { NumberGenerator } from './NumberGenerator'
import { ObjectGenerator } from './ObjectGenerator'
import { RandomValueGeneratorBase } from './primitives'
import { RandomItemPicker } from './RandomItemPicker'
import { StringGenerator } from './StringGenerator'

export interface PrimitiveTypeMap {
    'number': number,
    'string': string,
    'boolean': boolean,
    'array': unknown[],
    'object': Record<string, unknown>,
    'null': null,
    'undefined': undefined
}
export type PrimitiveTypeKey = keyof PrimitiveTypeMap
export type PrimitiveType = PrimitiveTypeMap[PrimitiveTypeKey]
export type PrimitiveTypeGeneratorMap = {
    readonly [K in PrimitiveTypeKey]?: IValueGenerator<PrimitiveTypeMap[K]>
}
export class PrimitiveValueGenerator extends RandomValueGeneratorBase<PrimitiveType> implements IValueGeneratorProvider<PrimitiveTypeMap> {
    static readonly DEFAULT: PrimitiveValueGenerator
    static readonly NO_COMPOUND: PrimitiveValueGenerator
    readonly generatorMap: PrimitiveTypeGeneratorMap
    readonly keys: PrimitiveTypeKey[]

    constructor(generatorMap?: PrimitiveTypeGeneratorMap | null, random?: Random | null) {
        super(random)
        this.generatorMap = generatorMap ?? PrimitiveValueGenerator.DEFAULT.generatorMap
        this.keys = Object.keys(this.generatorMap) as PrimitiveTypeKey[]
    }

    next(): PrimitiveType {
        const key = this.keys[randomInteger(this.keys.length - 1, 0, this.random)]
        const generator = this.generatorMap[key]

        return generator.next()
    }
    getExtremeValues(): PrimitiveType[] {
        return (Object.keys(this.generatorMap) as PrimitiveTypeKey[])
            .filter(key => key !== 'array' && key !== 'object')
            .flatMap(key => this.generatorMap[key].getExtremeValues() as PrimitiveType[])
            .concat([[], {}])
    }
    provide<K extends keyof PrimitiveTypeMap>(key: K): IValueGenerator<PrimitiveTypeMap[K]> {
        return this.generatorMap[key]
    }
}
const innerGeneratorMap = {
    'number': NumberGenerator.DEFAULT,
    'string': StringGenerator.DEFAULT,
    'boolean': BooleanGenerator.DEFAULT,
    'null': new RandomItemPicker<null>([null]),
    'undefined': new RandomItemPicker<undefined>([undefined])
}
const innerGenerator = new PrimitiveValueGenerator(innerGeneratorMap)
const defaultGeneratorMap = {
    ...innerGeneratorMap,
    'array': new ArrayGenerator(innerGenerator),
    'object': new ObjectGenerator(innerGenerator)
}
let _: any = (PrimitiveValueGenerator as any).DEFAULT = new PrimitiveValueGenerator(defaultGeneratorMap)
_ = (PrimitiveValueGenerator as any).NO_COMPOUND = innerGenerator
