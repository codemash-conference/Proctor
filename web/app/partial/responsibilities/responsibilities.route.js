(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('responsibilities', {
                    url: '/responsibilities',
                    templateUrl: 'app/partial/responsibilities/responsibilities.html',
                    controller: 'ResponsibilitiesController',
                    controllerAs: 'vm',
                    title: 'Responsibilities',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 2,
                        content: 'Responsibilities',
                        rolesAllowed: ['Everyone']
                    }
                });
        });

})();
