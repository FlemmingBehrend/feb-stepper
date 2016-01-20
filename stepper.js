(function () {
    'use strict';

    angular.module('feb.stepper', []).directive('febStepper', Stepper);

    function Stepper() {

        var CONSTANTS = {
            'CLASS_COMPLETED': 'feb-step-completed',
            'CLASS_ACTIVE': 'feb-step-active',
            'CLASS_STEP': 'feb-step',
            'CLASS_BUBBLE': 'feb-step-bubble',
            'CLASS_CONTAINER': 'feb-stepper-container',
            'CLASS_TEXT': 'feb-step-text',
            'CLASS_LINE_CELL': 'feb-line-cell'
        };

        var directive = {
            restrict: 'E',
            replace: false,
            transclude: true,
            link: link,
            scope: {
                steps: '@',
                control: '=',
                startStep: '@'
            }
        };

        return directive;

        function initControlObject(scope, counter) {
            scope.control = scope.control || {startStep: scope.startStep};
            scope.control.start = true;
            scope.control.end = false;
            scope.control.activeStep = scope.$eval(scope.startStep) || 0;
            scope.control.numberOfSteps = counter - 1;
        }

        function link(scope, element, attrs) {
            var steps = validateElementStepsAttribute(scope);
            var counter = buildComponent(steps, element);
            initControlObject(scope, counter);

            attrs.$observe('steps', function (newValue) {
                updateStepTexts(scope.$eval(newValue), element);
            });

            if (scope.startStep) {
                // we need to initialize the stepper at the start position.
                var startStep = scope.$eval(scope.startStep);
                var newActiveStep = fetchStep(startStep);
                newActiveStep.addClass(CONSTANTS.CLASS_ACTIVE);
                for (var i = 1; i < startStep; i++) {
                    var step = fetchStep(i);
                    step.addClass(CONSTANTS.CLASS_COMPLETED);
                }
                updateFlags();
            }

            scope.control.nextStep = function () {
                if (scope.control.end)
                    return;
                var currentStep = fetchStep(scope.control.activeStep);
                if (currentStep !== null) {
                    resetClasses(currentStep);
                    currentStep.addClass(CONSTANTS.CLASS_COMPLETED);
                }
                var newActiveStep = fetchStep(++scope.control.activeStep);
                resetClasses(newActiveStep);
                newActiveStep.addClass(CONSTANTS.CLASS_ACTIVE);
                updateFlags();
            };

            scope.control.prevStep = function () {
                if (scope.control.start)
                    return;
                resetClasses(fetchStep(scope.control.activeStep));
                var newActiveStep = fetchStep(--scope.control.activeStep);
                resetClasses(newActiveStep);
                newActiveStep.addClass(CONSTANTS.CLASS_ACTIVE);
                updateFlags();
            };

            scope.control.setActiveStep = function (index) {
                if (index === null || angular.isUndefined(index) || index < 0) {
                    throw 'Illegal step index. The index can not be undefined, null or negative';
                }
                if (index > scope.control.numberOfSteps) {
                    throw 'Illegal step index. The index can not be greater then the maximum number of steps';
                }
                scope.control.activeStep = index;
                for (var i=1; i<=scope.control.numberOfSteps; i++) {
                    var step = fetchStep(i);
                    resetClasses(step);
                    if (index > i) {
                        step.addClass(CONSTANTS.CLASS_COMPLETED);
                    } else if (index === i) {
                        step.addClass(CONSTANTS.CLASS_ACTIVE);
                    }
                }
                updateFlags();
            };

            function fetchStep(stepNumber) {
                var el = element[0].querySelector('.' + CONSTANTS.CLASS_STEP + stepNumber);
                if (el === null) {
                    return null;
                } else {
                    return angular.element(el);
                }
            }

            function validateElementStepsAttribute(scope) {
                if (!scope.steps) {
                    throw 'The stepper can not be initialized without a step attribute';
                }
                var steps = scope.$eval(scope.steps);
                if (steps.length < 2) {
                    throw 'The stepper needs minimum 2 steps to work';
                }
                return steps;
            }

            function buildStep(step) {
                return  '<div class="feb-step-container">' +
                            '<div class="' + CONSTANTS.CLASS_TEXT + '">' + step + '</div>' +
                            '<div class="feb-line-container">' +
                                '<div class="' + CONSTANTS.CLASS_LINE_CELL + '"></div>' +
                                '<div class="' + CONSTANTS.CLASS_BUBBLE + '"></div>' +
                                '<div class="' + CONSTANTS.CLASS_LINE_CELL + '"></div>' +
                            '</div>' +
                        '</div>';
            }

            function buildComponent(steps, element) {
                var template = '<div><ul class="' + CONSTANTS.CLASS_CONTAINER + '">';
                var counter = 1;
                angular.forEach(steps, function (step) {
                    template += '<li class="' + CONSTANTS.CLASS_STEP + '' + counter + '">' + buildStep(step) + '</li>';
                    counter++;
                });
                template += '</ul></div>';
                element.html(template);
                return counter;
            }

            function updateStepTexts(steps, element) {
                var counter = 1;
                var stepTexts = angular.element(element).find('div.feb-step-text');
                angular.forEach(steps, function (step) {
                    stepTexts[counter-1].innerText = step;
                    counter++;
                });
            }

            function updateFlags() {
                var as = scope.control.activeStep;
                if (as === 0 || as === 1) {
                    scope.control.start = true;
                    scope.control.end = false;
                } else if (as === scope.control.numberOfSteps) {
                    scope.control.start = false;
                    scope.control.end = true;
                } else {
                    scope.control.start = false;
                    scope.control.end = false;
                }
            }

            function resetClasses(step) {
                step.removeClass(CONSTANTS.CLASS_COMPLETED);
                step.removeClass(CONSTANTS.CLASS_ACTIVE);
            }

        }

    }

})();
