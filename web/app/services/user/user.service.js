(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('userService', userService);

    function userService($http, moment, localStorageService) {
        var user = {
            username: localStorageService.get('userName'),
            loggedIn: localStorageService.get('loggedIn'),
            email: localStorageService.get('email'),
            gravatar: localStorageService.get('gravatar'),
            firstName: localStorageService.get('firstName'),
            lastName: localStorageService.get('lastName'),
            call: localStorageService.get('cell'),
            roles: localStorageService.get('roles')
        };

        var service = {
            user: user
        };


        return service;

    }
})();
