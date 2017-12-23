(function() {
    'use strict';


    angular
        .module('app.partial')
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('404', {
                    url: '/404',
                    templateUrl: 'app/partial/404/404.html',
                    title: '404'
                });

            $urlRouterProvider.otherwise('/404');
        });
})();
