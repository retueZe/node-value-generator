import { IValueGenerator } from './IValueGenerator'

type CombinableArray<T> = ArrayLike<T> | IValueGenerator<T>
type CombinableArrays<T> = readonly [CombinableArray<T>]
type CombinableArrays2<T1, T2> = readonly [
    CombinableArray<T1>,
    CombinableArray<T2>
]
type CombinableArrays3<T1, T2, T3> = readonly [
    CombinableArray<T1>,
    CombinableArray<T2>,
    CombinableArray<T3>
]
type CombinableArrays4<T1, T2, T3, T4> = readonly [
    CombinableArray<T1>,
    CombinableArray<T2>,
    CombinableArray<T3>,
    CombinableArray<T4>
]
function adaptArrays<T>(arrays: ArrayLike<CombinableArray<T>>): ArrayLike<T>[] {
    const adapted = new Array<ArrayLike<T>>(arrays.length)

    for (let i = 0; i < arrays.length; i++) {
        const array = arrays[i]
        adapted[i] = 'length' in array
            ? array
            : array.getExtremeValues()
    }

    return adapted
}

export function combineArrays<T>(arrays: CombinableArrays<T>): [T][]
export function combineArrays<T1, T2>(arrays: CombinableArrays2<T1, T2>): [T1, T2][]
export function combineArrays<T1, T2, T3>(arrays: CombinableArrays3<T1, T2, T3>): [T1, T2, T3][]
export function combineArrays<T1, T2, T3, T4>(arrays: CombinableArrays4<T1, T2, T3, T4>): [T1, T2, T3, T4][]
export function combineArrays<T>(arrays: ArrayLike<CombinableArray<T>>): T[][] {
    const adaptedArrays = adaptArrays(arrays)
    const steps = new Array<number>(arrays.length)
    steps[0] = 1

    for (let i = 1; i < steps.length; i++) {
        steps[i] = steps[i - 1] * adaptedArrays[i - 1].length
    }

    const combinations = new Array<T[]>(steps[steps.length - 1] * adaptedArrays[steps.length - 1].length)

    for (let i = 0; i < combinations.length; i++) {
        const combination = new Array<T>(steps.length)
        combinations[i] = combination
        
        for (let j = 0; j < steps.length; j++) {
            const array = adaptedArrays[j]
            combination[j] = array[Math.floor(i / steps[j]) % array.length]
        }
    }

    return combinations
}
export function transposeArrays<T>(arrays: CombinableArrays<T>, defaultValues?: ArrayLike<T> | null): [T][]
export function transposeArrays<T1, T2>(arrays: CombinableArrays2<T1, T2>, defaultValues?: readonly [T1, T2] | null): [T1, T2][]
export function transposeArrays<T1, T2, T3>(arrays: CombinableArrays3<T1, T2, T3>, defaultValues?: readonly [T1, T2, T3] | null): [T1, T2, T3][]
export function transposeArrays<T1, T2, T3, T4>(arrays: CombinableArrays4<T1, T2, T3, T4>, defaultValues?: readonly [T1, T2, T3, T4] | null): [T1, T2, T3, T4][]
export function transposeArrays<T>(arrays: ArrayLike<CombinableArray<T>>, defaultValues?: ArrayLike<T> | null): T[][] {
    const adaptedArrays = adaptArrays(arrays)
    const minConcatedLength = adaptedArrays.reduce((acc, val) => Math.min(acc, val.length), Number.MAX_SAFE_INTEGER)
    const concatedLength = typeof defaultValues === 'undefined'
        ? minConcatedLength
        : adaptedArrays.reduce((acc, val) => Math.max(acc, val.length), 0)
    const concated = new Array<T[]>(concatedLength)

    for (let i = 0; i < minConcatedLength; i++) {
        const values = new Array<T>(adaptedArrays.length)
        concated[i] = values

        for (let j = 0; j < values.length; j++)
            values[j] = adaptedArrays[j][i]
    }
    for (let i = minConcatedLength; i < concated.length; i++) {
        const values = new Array<T>(adaptedArrays.length)
        concated[i] = values

        for (let j = 0; j < values.length; j++)
            values[j] = adaptedArrays[j][i] ?? defaultValues[i]
    }

    return concated
}
