# motion-input

> The module provides unified motion data across iOS and Android platforms.

## Installation

```sh
npm install [--save] collective-soundworks/motion-input
```

## Example

[https://cdn.rawgit.com/collective-soundworks/motion-input/c43ae4ae/examples/motion-input/index.html](motion-input)

## Usage

```js
const motionInput = require('motion-input');
 
motionInput
  .init(['acceleration', 'orientation', 'energy'])
  .then(([acceleration, orientation, energy]) => {
    if (acceleration.isValid)
      acceleration.addListener(val => console.log('acceleration', val));
    
    // ...
  })
  .catch(err => console.error(err.stack));
```

## Warning

Due to some weird (buggy ?) behavior in Chrome and and Firefox, if you need to use both `'acceleration'` and `'orientation'` modules, `'acceleration'` should always be initialized and listened **before** `'orientation'`.
