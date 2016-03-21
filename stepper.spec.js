(function () {
    'use strict';

    describe('directive: feb-stepper', function () {

        var scope, compile;

        beforeEach(function() {
            module('feb.stepper');
            inject(function($compile, $rootScope) {
                compile = $compile;
                scope = $rootScope.$new();
            });
        });

        // compile element
        function ce(htmlString) {
            var el = compile('<div>' + htmlString + '</div>')(scope);
            scope.$digest();
            return el;
        }

        describe('configuration', function() {

            it('is not allowed to create a stepper with no steps attribute', function() {
                expect(function () {
                    ce('<feb-stepper></feb-stepper>');
                }).toThrow();
            });

            it('is not allowed to create a stepper with zero steps', function() {
                expect(function () {
                    ce('<feb-stepper steps=[]></feb-stepper>');
                }).toThrow();
            });

            it('is not allowed to create a stepper with one step', function() {
                expect(function () {
                    ce('<feb-stepper steps=["step"]></feb-stepper>');
                }).toThrow();
            });

            it('creates a stepper without any active or completed steps', function() {
                scope.control = {};
                var el = ce('<feb-stepper control="control" steps="[\'step1\'\,\'step2\']"><feb-stepper>');
                expect(el.find('.feb-step-completed').length).toBe(0);
                expect(el.find('.feb-step-active').length).toBe(0);
                var directiveScope = el.find('feb-stepper').isolateScope();
                expect(directiveScope.control.start).toBe(true);
                expect(directiveScope.control.end).toBe(false);
                expect(directiveScope.control.activeStep).toBe(0);
                expect(directiveScope.control.numberOfSteps).toBe(2);
            });

            it('when 3 steps are supplied in the steps attribute the html should contain 3 elements', function() {
                scope.control = {};
                var el = ce('<feb-stepper control="control" steps="[\'step1\'\,\'step2\'\,\'step3\']"><feb-stepper>');
                var steps = el.find('ul >');
                expect(steps.length).toBe(3);
            });

            it('be possible to inject a control object', function() {
                scope.control = {};
                var el = ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                var directiveScope = el.find('feb-stepper').isolateScope();
                expect(directiveScope.control).toEqual(scope.control);
            });

            it('sets the numberOfSteps attribute in the control object to the number of elements', function() {
                scope.control = {};
                var el = ce('<feb-stepper control="control" steps="[\'step1\'\,\'step2\'\,\'step3\']"><feb-stepper>');
                var directiveScope = el.find('feb-stepper').isolateScope();
                expect(directiveScope.control.numberOfSteps).toBe(3);
            });

            describe('with start step defined', function() {

                it('sets the start step as active', function() {
                    scope.control = {};
                    var el = ce('<feb-stepper control="control" steps="[\'step1\'\,\'step2\'\,\'step3\']" start-step="2"><feb-stepper>');
                    expect(el.find('.feb-step-active').length).toBe(1);
                });

                it('set previous steps as completed', function() {
                    scope.control = {};
                    var el = ce('<feb-stepper control="control" steps="[\'step1\'\,\'step2\'\,\'step3\']" start-step="3"><feb-stepper>');
                    expect(el.find('.feb-step-completed').length).toBe(2);
                });

                it('set the start flag then start-step is set to 1', function() {
                    scope.control = {};
                    var el = ce('<feb-stepper control="control" steps="[\'step1\'\,\'step2\'\,\'step3\']" start-step="1"><feb-stepper>');
                    var directiveScope = el.find('feb-stepper').isolateScope();
                    expect(directiveScope.control.start).toBe(true);
                    expect(directiveScope.control.end).toBe(false);
                });

                it('set the end flag if the start-step is the last step', function() {
                    scope.control = {};
                    var el = ce('<feb-stepper control="control" steps="[\'step1\'\,\'step2\'\,\'step3\']" start-step="3"><feb-stepper>');
                    var directiveScope = el.find('feb-stepper').isolateScope();
                    expect(directiveScope.control.start).toBe(false);
                    expect(directiveScope.control.end).toBe(true);
                });

            });

        });

        describe('update', function() {

            it('step texts when step attribute changes', function() {
                scope.stepText = 'test';
                var el = ce('<feb-stepper steps="[\'{{stepText}}\'\,\'step2\'\,\'step3\']" control="control" start-step="1"><feb-stepper>');
                scope.stepText = 'updated';
                scope.$digest();
                var directiveScope = el.find('feb-stepper').isolateScope();
                expect(directiveScope.steps).toEqual('[\'updated\',\'step2\',\'step3\']');

            });
        });

        describe('navigation', function() {

            describe('when going ro next step', function() {

                it('completes the active step and sets the next step as active', function() {
                    scope.control = {};
                    var el = ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="1"><feb-stepper>');
                    expect(el.find('.feb-step1').hasClass('feb-step-active')).toBe(true);
                    scope.control.nextStep();
                    expect(el.find('.feb-step1').hasClass('feb-step-completed')).toBe(true);
                    expect(el.find('.feb-step2').hasClass('feb-step-active')).toBe(true);
                });

                it('sets the end flag if next step reach the last step', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="2"><feb-stepper>');
                    scope.control.nextStep();
                    expect(scope.control.end).toBe(true);
                    expect(scope.control.start).toBe(false);
                });

                it('does not increase the active step if the active step is the last step', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="3"><feb-stepper>');
                    scope.control.nextStep();
                    expect(scope.control.end).toBe(true);
                    expect(scope.control.start).toBe(false);
                    expect(scope.control.activeStep).toBe(3);
                    scope.control.nextStep();
                    expect(scope.control.end).toBe(true);
                    expect(scope.control.start).toBe(false);
                    expect(scope.control.activeStep).toBe(3);
                });

                it('set the end value in the control object when active step is the last step', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="2"><feb-stepper>');
                    expect(scope.control.start).toBe(false);
                    expect(scope.control.end).toBe(false);
                    scope.control.nextStep();
                    expect(scope.control.start).toBe(false);
                    expect(scope.control.end).toBe(true);
                });

                it('set the start flag when nextStep will select the first step', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                    scope.control.nextStep();
                    expect(scope.control.start).toBe(true);
                });

            });

            describe('when going to prev step', function() {

                it('make the current step unvisited and change the step before to active', function() {
                    scope.control = {};
                    var el = ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="2"><feb-stepper>');
                    expect(el.find('.feb-step2').hasClass('feb-step-active')).toBe(true);
                    scope.control.prevStep();
                    expect(el.find('.feb-step1').hasClass('feb-step-active')).toBe(true);
                    expect(el.find('.feb-step2').hasClass('feb-step-active')).toBe(false);
                    expect(el.find('.feb-step2').hasClass('feb-step-completed')).toBe(false);
                });

                it('does nothing if the active step is the first step', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="1"><feb-stepper>');
                    scope.control.prevStep();
                    expect(scope.control.end).toBe(false);
                    expect(scope.control.start).toBe(true);
                    expect(scope.control.activeStep).toBe(1);
                    scope.control.prevStep();
                    expect(scope.control.end).toBe(false);
                    expect(scope.control.start).toBe(true);
                    expect(scope.control.activeStep).toBe(1);
                });

                it('set the start flag if the previous step will be the first step', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="2"><feb-stepper>');
                    expect(scope.control.start).toBe(false);
                    expect(scope.control.end).toBe(false);
                    scope.control.prevStep();
                    expect(scope.control.start).toBe(true);
                    expect(scope.control.end).toBe(false);
                });

                it('clears the flags if we are not hitting start or end', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="3"><feb-stepper>');
                    expect(scope.control.start).toBe(false);
                    expect(scope.control.end).toBe(true);
                    scope.control.prevStep();
                    expect(scope.control.start).toBe(false);
                    expect(scope.control.end).toBe(false);
                });

            });

            describe('when setting specific step index', function() {

                it('is possible to set the current active step', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                    expect(scope.control.setActiveStep).toBeDefined();
                });

                it('sets the active step in the control object to the specified index', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                    scope.control.setActiveStep(2);
                    expect(scope.control.activeStep).toBe(2);
                });

                it('it is not possible to use null or undefined as index', function() {
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                    expect(function () {
                        scope.control.setActiveStep(null);
                    }).toThrow();
                    expect(function () {
                        scope.control.setActiveStep(undefined);
                    }).toThrow();
                });

                it('is not possible to set a negative index', function() {
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                    expect(function () {
                        scope.control.setActiveStep(-2);
                    }).toThrow();
                });

                it('is not possible to set an index higher than the maximum number of steps', function() {
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                    expect(function () {
                        scope.control.setActiveStep(4);
                    }).toThrow();
                });

                it('setting the index to zero clears any active steps and sets the start flag', function() {
                    scope.control = {};
                    ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control" start-step="3"><feb-stepper>');
                    scope.control.setActiveStep(0);
                    expect(scope.control.activeStep).toBe(0);
                    expect(scope.control.start).toBe(true);
                    expect(scope.control.end).toBe(false);
                });

                it('setting a new active index should leave other steps configured with correct classes', function() {
                    scope.control = {};
                    var el = ce('<feb-stepper steps="[\'step1\'\,\'step2\'\,\'step3\']" control="control"><feb-stepper>');
                    el.find('.feb-step1').addClass('feb-step-completed');
                    el.find('.feb-step2').addClass('feb-step-completed');
                    el.find('.feb-step3').addClass('feb-step-completed');
                    scope.control.setActiveStep(0);
                    expect(el.find('.feb-step1').hasClass('feb-step-completed')).toBe(false);
                    expect(el.find('.feb-step2').hasClass('feb-step-completed')).toBe(false);
                    expect(el.find('.feb-step3').hasClass('feb-step-completed')).toBe(false);
                    scope.control.setActiveStep(1);
                    expect(el.find('.feb-step1').hasClass('feb-step-active')).toBe(true);
                    expect(el.find('.feb-step2').hasClass('feb-step-completed')).toBe(false);
                    expect(el.find('.feb-step3').hasClass('feb-step-completed')).toBe(false);
                    scope.control.setActiveStep(2);
                    expect(el.find('.feb-step1').hasClass('feb-step-completed')).toBe(true);
                    expect(el.find('.feb-step2').hasClass('feb-step-active')).toBe(true);
                    expect(el.find('.feb-step3').hasClass('feb-step-completed')).toBe(false);
                    scope.control.setActiveStep(3);
                    expect(el.find('.feb-step1').hasClass('feb-step-completed')).toBe(true);
                    expect(el.find('.feb-step2').hasClass('feb-step-completed')).toBe(true);
                    expect(el.find('.feb-step3').hasClass('feb-step-active')).toBe(true);
                });

            });

        });
    });

})();
