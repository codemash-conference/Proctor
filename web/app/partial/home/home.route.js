(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('/', {
                    url: '',
                    templateUrl: 'app/partial/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    title: 'Home',
                    resolve: {},
                    settings: {
                        nav: 0,
                        content: '<i class="fa fa-lock"></i> Login'
                    }
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'app/partial/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    title: 'Home',
                    resolve: {},
                    settings: {
                        nav: 0,
                        content: '<i class="fa fa-lock"></i> Login'
                    }
                })
                .state('volunteerapp', {
                    url: '/volunteer',
                    templateUrl: 'app/partial/home/volunteer-app.html',
                    controller: 'VolunteerAppController',
                    controllerAs: 'vm',
                    title: 'Volunteer Application',
                    resolve: {},
                    settings: {
                        nav: 0,
                        content: '<i class="fa fa-lock"></i> Login'
                    }
                });
        });
})();
