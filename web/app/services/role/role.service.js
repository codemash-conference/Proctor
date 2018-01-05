(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('roleService', roleService);

    function roleService($q, $http, moment, config) {

        var service = {
            getRoles: getRoles,
            getRoleById: getRoleById,
            createRole: createRole,
            updateRole: updateRole,
            deleteRole: deleteRole,
            getUsersForRole: getUsersForRole,
            getUsersForRoleName: getUsersForRoleName
        };

        return service;

        function getRoles(){
            var apiUrl = config.apiUrl + '/api/Role';

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function getRoleById(id) {
            var apiUrl = config.apiUrl + '/api/Role/' + id;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function createRole(roleName) {
            var apiUrl = config.apiUrl + '/api/Role';

            return $http.post(apiUrl, roleName)
                .then(function(response){
                    return response;
                });

        }

        function updateRole(role) {
            var apiUrl = config.apiUrl + '/api/Role';

            return $http.put(apiUrl, role)
                .then(function(response){
                    return response;
                });
        }

        function deleteRole(id) {
            var apiUrl = config.apiUrl + '/api/Role/' + id;

            return $http.delete(apiUrl)
                .then(function(response){
                    return response;
                });
        }

        function getUsersForRole(id) {
            var apiUrl = config.apiUrl + '/api/Role/GetUsersForRole?id=' + id;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function getUsersForRoleName(name) {
            var apiUrl = config.apiUrl + '/api/Role/GetUsersForRoleName?name=' + name;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }
    }
})();
