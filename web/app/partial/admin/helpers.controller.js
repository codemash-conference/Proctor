/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('HelpersController', HelpersController);

    function HelpersController($q, sessionService, logger, moment) {
        var vm = this;
        vm.title = 'Helpers';
        vm.sessions = [];
        vm.rooms = [];
        vm.dates = [];

        vm.getSessionsForRoomAndDate = getSessionsForRoomAndDate;
        activate();


        function activate() {
            getSessions();
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var parsed = _.chain(data)
                    .filter(function(session) {
                        return session.sessionType === 'Static Session';
                    })
                    .sortBy(function(session) { return session.sessionStartTime; })
                    .forEach(function(session) {
                        session.roomString =  _.map(
                            _.sortBy(session.rooms,function(room) { return room.name;}),
                            'name')
                            .join(',');
                    })
                    .value();

                vm.dates = _.chain(parsed).uniqBy(function(session) {
                    return moment(session.sessionStartTime).format("M/D/YY");
                })
                    .map(function(session){ return moment(session.sessionStartTime).format("M/D/YY");})
                    .value();

                vm.rooms = _.chain(parsed)
                    .uniqBy(function(session) {
                        return session.roomString;
                    })
                    .sortBy(function(session){ return session.roomString;})
                    .map(function(session){ return session.roomString;})
                    .value();

                vm.sessions = parsed;
            });
        }

        function getSessionsForRoomAndDate(room, date) {
            return _.filter(vm.sessions, function(session){
                return session.roomString === room &&
                    moment(session.sessionStartTime).format("M/D/YY") === date;
            });
        }
    }
})();
/* jshint +W117 */
