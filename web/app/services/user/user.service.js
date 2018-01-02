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
            roles: localStorageService.get('roles'),
            userId: localStorageService.get('userId'),
            userObj: localStorageService.get('userObj')
        };

        var service = {
            user: user,
            getAllUsers: getAllUsers,
            createUser: createUser,
            updateUser: updateUser,
            deleteUser: deleteUser,
            addUserToRole : addUserToRole,
            removeUserFromRole : removeUserFromRole,
            getNewUserObj: getNewUserObj
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
            var apiUrl = config.apiUrl + '/api/Role/RemoveUserFromRole?userId=' + userId + '&roleId=' + roleId;

            return $http.delete(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function deleteUser(userId){
            var apiUrl = config.apiUrl + '/api/Users/' + userId;

            return $http.delete(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }
        function createUser(user) {
            var apiUrl = config.apiUrl + '/api/Users';

            return $http.post(apiUrl, user)
                .then(function(response){
                    return response;
                });

        }

        function updateUser(user) {
            var apiUrl = config.apiUrl + '/api/Users/' + user.id;

            return $http.put(apiUrl, user)
                .then(function(response){
                    return response;
                });
        }

        function getNewUserObj() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                cellNumber: '',
                password: '',
                userName: '',
                EmailConfirmed: true,
                IsActive: true
            };
        }
    }
})();
