(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('home', {
                    url: '',
                    templateUrl: 'app/partial/my-schedule/myschedule.html',
                    controller: 'MyScheduleController',
                    controllerAs: 'vm',
                    title: 'My Schedule'
                })
                .state('myschedule', {
                    url: '/myschedule',
                    templateUrl: 'app/partial/my-schedule/myschedule.html',
                    controller: 'MyScheduleController',
                    controllerAs: 'vm',
                    title: 'My Schedule',
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 1,
                        content: 'My Schedule',
                        rolesAllowed: ['Everyone']
                    }
                });
        });
})();
