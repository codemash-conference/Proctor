(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('sessionresults', {
                    url: '/sessionresults',
                    templateUrl: 'app/partial/session-results/session-results.html',
                    controller: 'SessionResultsController',
                    controllerAs: 'vm',
                    title: 'Session Results',
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 4,
                        content: 'Session Results',
                        rolesAllowed: ['Admin', 'Board', 'Volunteer Admin']
                    }
                });
        });
})();
