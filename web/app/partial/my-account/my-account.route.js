(function() {
    'use strict';

    angular
        .module('app.partial')
        .config(function($stateProvider) {
            $stateProvider
                .state('myaccount', {
                    url: '/myaccount',
                    templateUrl: 'app/partial/my-account/my-account.html',
                    controller: 'MyAccountController',
                    controllerAs: 'vm',
                    title: 'My Account',
                    settings: {
                        mainNavigation: true,
                        level: 0,
                        ordinal: 8,
                        content: 'My Account',
                        rolesAllowed: ['Everyone']
                    }
                });
        });
})();
