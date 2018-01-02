(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('checkin', {
                    url: '/checkin/:sessionId',
                    templateUrl: 'app/partial/check-in/check-in.html',
                    controller: 'CheckInController',
                    controllerAs: 'vm',
                    title: 'Check In',
                    resolve: {},
                    settings: {
                        mainNavigation: false,
                        level: 3,
                        ordinal: 1,
                        content: 'Check In',
                        rolesAllowed: ['Everyone']
                    }
                });
        });

})();
