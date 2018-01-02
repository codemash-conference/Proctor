'use strict';
(function() {
    angular
        .module('app.filters')
        .filter('staticSessionCsvToObj', staticSessionCsvToObj);

    function staticSessionCsvToObj(sessionService) {
        return function(input) {
            var rows = input.split('\n');
            var obj = [];
            angular.forEach(rows, function (val) {
                var o = val.split(',');
                var session = sessionService.newSessionObj();
                session.sessionStartTime= o[0];
                session.sessionEndTime= o[1];
                session.rooms= [{ name: o[2] }];
                session.title= o[3];
                session.abstract= o[4];
                session.sessionType= 'Static Session';
                session.volunteersRequired= o[6];
                obj.push(session);
            });
            return obj;
        };
    }
}());
