# motion-input
The motion input module provides unified motion data across iOS and Android platforms.

The motion input module may be used as follows:
```
const input = require('motion-input');
const requiredEvents = ['acceleration', 'orientation', 'energy'];
 
input
 .init(requiredEvents)
 .then((modules) => {
   const [acceleration, orientation, energy] = modules;

   if (acceleration.isValid) {
     input.addListener('acceleration', (val) => {
       console.log('acceleration', val);
       // do something with the acceleration values
     });
   }

   // do something else with the other modules
 });
```