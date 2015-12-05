// TODO: should it fire events when hitting start and end??
// TODO: refactor the code now that it honor the spec
// TODO: support for language change
(function () {
    'use strict';

    angular.module('feb.stepper', []).directive('febStepper', Stepper);

    function Stepper() {

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

        function validateAndEvaluateSteps(scope) {
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
            return '<table style="width: 100%" cellpadding="0" cellspacing="0">' +
                        '<tr><td class="feb-step-text" colspan="3">' + step + '</td></tr>' +
                        '<tr>' +
                            '<td style="width: 50%">' + buildLine() + '</td>' +
                            '<td style="width: 1%"><span class="feb-step-bubble"></span></td>' +
                            '<td style="width: 50%">' + buildLine() + '</td>' +
                        '</tr>' +
                    '</table>';
        }

        function buildLine() {
            return '<table style="width: 100%" cellpadding="0" cellspacing="0">' +
                        '<tr><td></td></tr>' +
                        '<tr><td class="feb-line-cell"></td></tr>' +
                        '<tr><td></td></tr>' +
                    '</table>'
        }

        function buildComponent(steps, element) {
            var template = '<div><ul class="feb-stepper-container">';
            var counter = 1;
            angular.forEach(steps, function (step) {
                template += '<li class="feb-step' + counter + '">' + buildStep(step) + '</li>';
                counter++;
            });
            template += '</ul></div>';
            element.html(template);
            return counter;
        }

        function initControlObject(scope, counter) {
            scope.control = scope.control || {startStep: scope.startStep};
            scope.control.start = true;
            scope.control.end = false;
            scope.control.activeStep = scope.$eval(scope.startStep) || 0;
            scope.control.numberOfSteps = counter - 1;
        }

        function link(scope, element, attrs) {
            var steps = validateAndEvaluateSteps(scope);
            var counter = buildComponent(steps, element);
            initControlObject(scope, counter);

            if (scope.startStep) {
                // we need to initialize the stepper at the start position.
                var startStep = scope.$eval(scope.startStep);
                var newActiveStep = fetchStep(startStep);
                newActiveStep.addClass('feb-step-active');
                for (var i = 1; i < startStep; i++) {
                    var step = fetchStep(i);
                    step.addClass('feb-step-completed');
                }
                if (startStep === scope.control.numberOfSteps) {
                    scope.control.start = false;
                    scope.control.end = true;
                } else if (startStep === 0 || startStep === 1) {
                    scope.control.start = true;
                    scope.control.end = false;
                } else {
                    scope.control.start = false;
                    scope.control.end = false;
                }
            }

            scope.control.nextStep = function () {
                var elementForCurrentStep = fetchStep(scope.control.activeStep);
                var elementForNewActiveStep = fetchStep(++scope.control.activeStep);
                if (elementForNewActiveStep === null) {
                    scope.control.activeStep--;
                    return;
                }
                if (elementForCurrentStep !== null) {
                    elementForCurrentStep.removeClass('feb-step-active');
                    elementForCurrentStep.addClass('feb-step-completed');
                }
                elementForNewActiveStep.addClass('feb-step-active');
                if (scope.control.activeStep === scope.control.numberOfSteps) {
                    scope.control.end = true;
                    scope.control.start = false;
                } else {
                    scope.control.end = false;
                    if (scope.control.activeStep === 0 || scope.control.activeStep === 1) {
                        scope.control.start = true;
                    }
                }
            };

            scope.control.prevStep = function () {
                var elementForCurrentStep = fetchStep(scope.control.activeStep);
                var elementForNewActiveStep = fetchStep(--scope.control.activeStep);
                if (elementForNewActiveStep === null) {
                    scope.control.activeStep++;
                    return;
                }
                elementForCurrentStep.removeClass('feb-step-active');
                elementForNewActiveStep.removeClass('feb-step-completed');
                elementForNewActiveStep.addClass('feb-step-active');
                if (scope.control.activeStep === 1) {
                    scope.control.start = true;
                    scope.control.end = false;
                } else {
                    scope.control.start = false;
                    scope.control.end = false;
                }
            };

            function fetchStep(stepNumber) {
                var el = element[0].querySelector('.feb-step' + stepNumber);
                if (el === null) {
                    return null;
                } else {
                    return angular.element(el);
                }
            }

        }

    }

})();
