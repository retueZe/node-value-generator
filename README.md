### Examples

```javascript
const generator = PrimitiveValueGenerator.NO_COMPOUND

console.log(generator.next()) // undefined
console.log(generator.next()) // wrafIvF222BkV8NWjcc9UTgnMV
console.log(generator.next()) // 1.3011991493457694e+308
```

```javascript
const picker = new RandomItemPicker([1, 2, 3])

console.log(picker.next()) // 2
console.log(picker.next()) // 3
console.log(picker.next()) // 1
console.log(picker.next()) // 1
```

```javascript
const randomValues = [0.4, 0.9, 0.5]
const random = () => randomValues.shift() ?? 0
const sourceGenerator = new NumberGenerator(null, null, random) // default boundaries: [10;50], generates floats
const generator = sourceGenerator.limit(3, 0, true) // new boundaries: [0;3], generates integers
console.log(generator.next()) // 1
console.log(generator.next()) // 3
console.log(generator.next()) // 2
console.log(generator.next()) // 0
console.log(generator.next()) // 0
```

### Testing

```javascript
it.each(StringGenerator.DEFAULT.take(10))('test', input => {
    // ...
})
```

```javascript
it.each(combineArrays([ // returns all combinations of given arrays
    BooleanGenerator.DEFAULT, // extreme values: [true, false]
    NumberGenerator.DEFAULT.take(10, 5, -5, true) // array of 10 integers in [-5;5]
]))('test', (boolean, integer) => {
    // ...
})
```

```javascript
it.each(transposeArrays([
    [1, 2, 3, 4],
    [true, false, false],
    ['a', 'b', 'c', 'd', 'e']
]))('test', (integer, boolean, string) => { // executes 3 times with [1, true, 'a'], [2, false, 'b'], [3, false, 'c']
    // ...
})
```