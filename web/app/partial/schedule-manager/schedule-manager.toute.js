(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('schedulemanager', {
                    url: '/admin',
                    abstract: true,
                    controller: 'ScheduleManagerController',
                    controllerAs: 'vm',
                    templateUrl: 'app/partial/schedule-manager/schedule-manager.html',
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 4,
                        content: 'Schedule Manager',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('schedulemanager.manage', {
                    url: '/manage',
                    templateUrl: 'app/partial/schedule-manager/manage.html',
                    controller: 'ManageController',
                    controllerAs: 'vm',
                    title: 'Manage',
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 1,
                        content: 'Manage',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('schedulemanager.pending', {
                    url: '/pending',
                    templateUrl: 'app/partial/schedule-manager/pending.html',
                    controller: 'PendingController',
                    controllerAs: 'vm',
                    title: 'Pending',
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 4,
                        content: 'Pending',
                        rolesAllowed: ['Admin']
                    }
                });
        });
})();
