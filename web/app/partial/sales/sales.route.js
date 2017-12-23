(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('sales', {
                    url: '/sales',
                    templateUrl: 'app/partial/sales/sales.html',
                    controller: 'SalesController',
                    controllerAs: 'vm',
                    title: 'Sales',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 3,
                        content: '<i class="fa fa-dashboard"></i> Sales',
                        rolesAllowed: ['Everyone']
                    }
                });
        });

})();
