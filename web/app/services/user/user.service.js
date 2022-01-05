(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('userService', userService);

    function userService($http, moment, localStorageService, config) {
        var user = function(){
            return {
            username: localStorageService.get('userName'),
            loggedIn: localStorageService.get('loggedIn'),
            email: localStorageService.get('email'),
            gravatar: localStorageService.get('gravatar'),
            firstName: localStorageService.get('firstName'),
            lastName: localStorageService.get('lastName'),
            call: localStorageService.get('cell'),
            roles: localStorageService.get('roles'),
            userId: localStorageService.get('userId'),
            userObj: localStorageService.get('userObj')};
        };

        var service = {
            user: user,
            getAllUsers: getAllUsers,
            getUserById:getUserById,
            createUser: createUser,
            register: register,
            updateUser: updateUser,
            deleteUser: deleteUser,
            addUserToRole : addUserToRole,
            removeUserFromRole : removeUserFromRole,
            getNewUserObj: getNewUserObj,
            resetPassword: resetPassword,
            adminResetPassword: adminResetPassword
        };


        return service;

        function getAllUsers() {
            var apiUrl = config.apiUrl + '/api/Users';

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });

        }

        function getUserById(userId) {
            var apiUrl = config.apiUrl + '/api/Users/' + userId;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function addUserToRole(userId, roleId) {
            var apiUrl = config.apiUrl + '/api/Roles/AddUserToRole?userId=' + userId + '&roleId=' + roleId;

            return $http.post(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function removeUserFromRole(userId, roleId) {
            var apiUrl = config.apiUrl + '/api/Roles/RemoveUserFromRole?userId=' + userId + '&roleId=' + roleId;

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

        function register(user) {
            var apiUrl = config.apiUrl + '/api/register';
            user.UserName = user.Email; //Make the username the email address
            return $http.post(apiUrl, user)
                .then(function(response){
                    return response;
                });

        }

        function updateUser(user) {
            var apiUrl = config.apiUrl + '/api/Users/' + user.Id;

            return $http.put(apiUrl, user)
                .then(function(response){
                    return response;
                });
        }

        function resetPassword(resetPasswordArgs) {
            var apiUrl = config.apiUrl + '/api/Users/PasswordReset';

            return $http.put(apiUrl, resetPasswordArgs)
                .then(function(response){
                    return response;
                }, function (reason) {
                    return reason;
                });
        }

        function adminResetPassword(resetPasswordArgs) {
            var apiUrl = config.apiUrl + '/api/Users/AdminPasswordReset';

            return $http.put(apiUrl, resetPasswordArgs)
                .then(function(response){
                    return response;
                }, function (reason) {
                    return reason;
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
                IsActive: true,
                Gender: '',
                School: '',
                Major: '',
                TopicsInterestedIn: '',
                Essay: '',
                PreviousVolunteer: false,
                VolunteerYears: 0
            };
        }
    }
})();
