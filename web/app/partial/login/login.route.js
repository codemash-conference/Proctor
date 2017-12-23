(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/partial/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'login',
                    resolve: {},
                    settings: {
                        nav: 0,
                        content: '<i class="fa fa-lock"></i> Login'
                    }
                });
        });
})();
