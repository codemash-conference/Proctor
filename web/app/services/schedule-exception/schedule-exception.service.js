(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('scheduleExceptionService', scheduleExceptionService);

    function scheduleExceptionService($http, moment, config) {


        var service = {
            getAllExceptions: getAllExceptions,
            createException: createException,
            updateException: updateException,
            deleteException: deleteException,
            getNewScheduleExceptionObj: getNewScheduleExceptionObj
        };


        return service;

        function getAllExceptions() {
            var apiUrl = config.apiUrl + '/api/ScheduleExceptions';

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });

        }

        function deleteException(exceptionId){
            var apiUrl = config.apiUrl + '/api/ScheduleExceptions/' + exceptionId;

            return $http.delete(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }
        function createException(exception) {
            var apiUrl = config.apiUrl + '/api/ScheduleExceptions';

            return $http.post(apiUrl, exception)
                .then(function(response){
                    return response;
                });

        }

        function updateException(exception) {
            var apiUrl = config.apiUrl + '/api/ScheduleExceptions/' + exception.id;

            return $http.put(apiUrl, exception)
                .then(function(response){
                    return response;
                });
        }

        function getNewScheduleExceptionObj() {
            return {
                firstName: '',
                lastName: '',
                userId: null,
                startTime: null,
                endTime: null
            };
        }
    }
})();
