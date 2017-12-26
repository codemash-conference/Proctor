(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('sessionService', sessionService);


    function sessionService($q, $http, config) {

        var service = {
            getSessions: getSessions,
            getSessionById: getSessionById,
            updateSession: updateSession,
            createSession: createSession,
            deleteSession: deleteSession,
            importSessionData: importSessionData
        };

        return service;

        function getSessions() {
            var apiUrl = config.apiUrl + '/api/Sessions';

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function getSessionById(id) {
            var apiUrl = config.apiUrl + '/api/Sessions/' + id;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function updateSession(session) {
            var apiUrl = config.apiUrl + '/api/Sessions/' + session.Id;

            return $http.put(apiUrl, session)
                .then(function(response){
                    return response.data;
                });
        }

        function createSession(session){
            var apiUrl = config.apiUrl + '/api/Sessions';

            return $http.post(apiUrl, session)
                .then(function(response){
                    return response.data;
                });
        }

        function deleteSession(id) {
            var apiUrl = config.apiUrl + '/api/Sessions/' + id;

            return $http.delete(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function importSessionData() {
            var apiUrl = config.apiUrl + '/api/Sessions/ImportFromFeed';

            return $http.get(apiUrl)
                .then(function(response){
                    return response;
                });

        }



    }
})();
