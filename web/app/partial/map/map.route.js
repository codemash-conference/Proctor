(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('map', {
                    url: '/map',
                    templateUrl: 'app/partial/map/map.html',
                    controller: 'MapController',
                    controllerAs: 'vm',
                    title: 'Map',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 3,
                        content: 'Map',
                        rolesAllowed: ['Everyone']
                    }
                });
        });

})();
