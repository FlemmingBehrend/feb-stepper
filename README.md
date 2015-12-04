# feb-stepper [![Build Status](https://travis-ci.org/FlemmingBehrend/feb-stepper.svg)](https://travis-ci.org/FlemmingBehrend/feb-stepper)
Angular directive to visually show steps in a wizards etc. If it does not fit your needs you are welcome to fork and build your own version based on this.

##Usage
1. Type `bower install FlemmingBehrend/feb-stepper`
2. Add the css to your index.hxml with `<link rel="stylesheet" href="bower_components/feb-stepper/stepper.css">`
3. Add the script to your index.html with `<script src="bower_components/feb-stepper/stepper.js></script>`
4. Insert the directive into your html page  
```javascript
<feb-stepper 
    // An array of strings, each string transform to a new step
    steps="['step1', 'step2']" 
    
    // The control object that is bound to the scope that the stepper is added
    // This is used to communicate between the controller and the directive (two ways)
    control="stepperControl"
    
    // The start step for stepper. The number will be the active step in the array of steps
    start-step="1">
</feb-stepper>
```
