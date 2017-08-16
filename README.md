# motion-input

> Module that provides unified motion data across platforms (iOS and Android) and browsers.

## Installation

```sh
npm install [--save] collective-soundworks/motion-input
```

## Example

[motion-input](https://cdn.rawgit.com/collective-soundworks/motion-input/c43ae4ae/examples/motion-input/index.html)

## Usage

```js
const motionInput = require('motion-input');
 
motionInput
  .init(['accelerationIncludingGravity'])
  .then(([accelerationIncludingGravity]) => {

    if (accelerationIncludingGravity.isValid) {
      accelerationIncludingGravity.addListener(val => {
        console.log('acceleration', val) 
      });
    }
    // ...
  })
  .catch(err => console.error(err.stack));
```

## Warning

Due to some weird (buggy ?) behavior in Chrome and and Firefox, if you need to use both `'acceleration'` and `'orientation'` modules, `'acceleration'` should always be initialized and listened **before** `'orientation'`.
