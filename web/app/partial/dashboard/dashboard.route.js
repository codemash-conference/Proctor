(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('home', {
                    url: '',
                    templateUrl: 'app/partial/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'Dashboard'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'app/partial/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'Dashboard',
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard',
                        rolesAllowed: ['Everyone']
                    }
                });
        });
})();
