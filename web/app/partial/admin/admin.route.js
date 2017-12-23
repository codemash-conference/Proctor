(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('admin', {
                    url: '/admin',
                    abstract: true,
                    controller: 'AdminController',
                    controllerAs: 'vm',
                    templateUrl: 'app/partial/admin/admin.html',
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 2,
                        content: '<i class="fa fa-lock"></i> Admin',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('admin.groups', {
                    url: '/groups',
                    templateUrl: 'app/partial/admin/groups.html',
                    controller: 'GroupsController',
                    controllerAs: 'vm',
                    title: 'Groups',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 1,
                        content: ' Groups',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('admin.users', {
                    url: '/users',
                    templateUrl: 'app/partial/admin/users.html',
                    controller: 'UsersController',
                    controllerAs: 'vm',
                    title: 'Users',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 2,
                        content: ' Users',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('admin.scheduleAdmin', {
                    url: '/scheduleadmin',
                    templateUrl: 'app/partial/admin/scheduleadmin.html',
                    controller: 'ScheduleAdminController',
                    controllerAs: 'vm',
                    title: 'Schedule Admin',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 3,
                        content: ' Schedule Admin',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('admin.staticschedule', {
                    url: '/staticschedule',
                    templateUrl: 'app/partial/admin/staticschedule.html',
                    controller: 'StaticScheduleController',
                    controllerAs: 'vm',
                    title: 'Static Schedule',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 4,
                        content: ' Static Schedule',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('admin.helpers', {
                    url: '/helpers',
                    templateUrl: 'app/partial/admin/helpers.html',
                    controller: 'HelpersController',
                    controllerAs: 'vm',
                    title: 'Helpers',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 5,
                        content: ' Helpers',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('admin.exportsessions', {
                    url: '/exportsessions',
                    templateUrl: 'app/partial/admin/exportsessions.html',
                    controller: 'ExprtSessionsController',
                    controllerAs: 'vm',
                    title: 'Export Sessions',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 6,
                        content: ' Export Sessions',
                        rolesAllowed: ['Admin']
                    }
                })
                .state('admin.allschedules', {
                    url: '/allschedules',
                    templateUrl: 'app/partial/admin/allschedules.html',
                    controller: 'AllSchedulesController',
                    controllerAs: 'vm',
                    title: 'All Schedules',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 1,
                        ordinal: 7,
                        content: ' All Schedules',
                        rolesAllowed: ['Admin']
                    }
                });
        });

})();
