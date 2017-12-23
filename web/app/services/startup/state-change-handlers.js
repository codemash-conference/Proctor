/* Help configure the state-base ui.router */
(function() {
    'use strict';

    angular.module('app.services')
        .run(function($rootScope, $location, $state, logger){  /* do not remove $state from here! */
            var handlingStateChangeError = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function(event, toState, toParams, fromState, fromParams, error) {
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var destination = (toState &&
                            (toState.title || toState.name || toState.loadedtemplateUrl)) ||
                            'unknown target';
                        var msg = 'Error routing to ' + destination + '. ' +
                            (error.data || '') + '. <br/>' + (error.statusText || '') +
                            ': ' + (error.status || '');
                        logger.warning(msg, [toState]);
                        $location.path('/');
                    }
                );

            }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
                    }
                );
            }
            init();
        });
})();
