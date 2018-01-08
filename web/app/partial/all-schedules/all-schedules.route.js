(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('allschedules', {
                    url: '/allschedules',
                    templateUrl: 'app/partial/all-schedules/all-schedules.html',
                    controller: 'AllUsersSchedulesController',
                    controllerAs: 'vm',
                    title: 'All Schedules',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 7,
                        content: 'All Schedules',
                        rolesAllowed: ['Everyone']
                    }
                });
        });

})();
