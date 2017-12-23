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
                        ordinal: 4,
                        content: '<i class="fa fa-dashboard"></i> Responsibilities',
                        rolesAllowed: ['Everyone']
                    }
                });
        });

})();
