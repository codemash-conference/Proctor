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
            importSessionData: importSessionData,
            newSessionObj: newSessionObj,
            autoAssignSessions: autoAssignSessions,
            getSessionsPerUser: getSessionsPerUser,
            getUserSchedule: getUserSchedule,
            getRooms: getRooms
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
            var apiUrl = config.apiUrl + '/api/Sessions/' + session.id;

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

        function newSessionObj() {
            return {
                "assignees": [],
                "sessionCheckInInfo": null,
                "sessionTime": "0001-01-01T00:00:00",
                "sessionStartTime": "",
                "sessionEndTime": "",
                "rooms": [],
                "title": "",
                "abstract": "",
                "sessionType": "Static Session",
                "tags": null,
                "category": "",
                "speakers": null,
                "volunteersRequired": 0
            };
        }

        function autoAssignSessions() {
            var apiUrl = config.apiUrl + '/api/Sessions/AutoAssign';

            return $http.put(apiUrl)
                .then(function(response){
                    return response;
                });
        }

        function getSessionsPerUser() {
            var apiUrl = config.apiUrl + '/api/Sessions/GetSessionsPerUser';

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function getUserSchedule(userId) {
            var apiUrl = config.apiUrl + '/api/Sessions/GetUserSchedule?userId=' + userId;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function getRooms() {
            var apiUrl = config.apiUrl + '/api/Room';

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }
    }
})();