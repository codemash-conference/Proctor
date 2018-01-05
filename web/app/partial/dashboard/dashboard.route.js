(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'app/partial/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'Dashboard',
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 4,
                        content: 'Dashboard',
                        rolesAllowed: ['Admin']
                    }
                });
        });
})();
