(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('userService', userService);

    function userService($http, moment, localStorageService, config) {
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
            user: user,
            getAllUsers: getAllUsers,
            addUserToRole : addUserToRole,
            removeUserFromRole : removeUserFromRole
        };


        return service;

        function getAllUsers() {
            var apiUrl = config.apiUrl + '/api/Users';

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });

        }

        function addUserToRole(userId, roleId) {
            var apiUrl = config.apiUrl + '/api/Role/AddUserToRole?userId=' + userId + '&roleId=' + roleId;

            return $http.post(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function removeUserFromRole(userId, roleId) {
            var apiUrl = config.apiUrl + '/api/Role/AddUserToRole?userId=' + userId + '&roleId=' + roleId;

            return $http.delete(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }
    }
})();
