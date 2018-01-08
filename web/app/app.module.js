(function () {
    'use strict';

    var app = angular.module('app', [
        'app.components',
        'app.partial',
        'app.services',
        'app.directives',
        'ui.bootstrap',
        'app.filters',
        'ui.select',
        'datatables',
        'datatables.buttons'

    ]);

    app.run(function($rootScope, $state, localStorageService){




        $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
            /*
             logger.log("Route State Change Start!!");
             logger.log(e);
             logger.log(toState);
             logger.log(toParams);
             logger.log(fromState);
             logger.log(fromParams);
             */
            if (angular.isObject(toState) && toState.name) {
                if(toState.name !== "login" && !localStorageService.get('loggedIn')){
                    e.preventDefault();
                    $state.go("login");
                }
            }
        });
    });
})();
