(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('faq', {
                    url: '/faq',
                    templateUrl: 'app/partial/faq/faq.html',
                    controller: 'FaqController',
                    controllerAs: 'vm',
                    title: 'FAQ',
                    resolve: {},
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 2,
                        content: 'FAQ',
                        rolesAllowed: ['Everyone']
                    }
                });
        });

})();
