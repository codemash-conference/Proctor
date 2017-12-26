/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ScheduleAdminController', ScheduleAdminController);

    function ScheduleAdminController($q, sessionService, logger, moment) {
        var vm = this;
        vm.title = 'User';
        vm.sessions = [];
        vm.currentDate = '';
        vm.dates = [];
        vm.rooms = [];

        vm.importFeed = importFeed;
        vm.sessionsByDateAndRoom = sessionsByDateAndRoom;
        vm.getCardState = getCardState;
        vm.getTop = getTop;
        vm.getHeight = getHeight;

        activate();

        function activate() {
            getSessions();
        }

        function importFeed() {
            sessionService.importSessionData().then(function(response){

            });
        }
        function sessionsByDateAndRoom(cDate, room) {
            return _.filter(vm.sessions, function (session) {
               return cDate === moment(session.sessionStartTime).format("M/D/YY") &&
                   room === session.roomString;
            });
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var parsed = _.chain(data)
                    .filter(function(session) {
                        return session.sessionType === 'General Session' ||
                            session.sessionType === 'Pre-Compiler' ||
                            session.sessionType === 'Static Session';
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

                vm.currentDate = vm.dates[0];
                vm.sessions = parsed;
            });
        }

        function getCardState(session) {
            return '';
        }

        function getTop(session) {
            var x = moment.duration(moment(session.sessionStartTime).format('HH:mm')) / 60000;
            x = x - 375;
            return x.toString() + 'px';
        }

        function getHeight(session) {
            var x = moment.duration(moment(session.sessionStartTime).format('HH:mm')) / 60000;
            var y = moment.duration(moment(session.sessionEndTime).format('HH:mm')) / 60000;
            var z = (y - x);
            return z.toString() + 'px';
        }
    }
})();
/* jshint +W117 */
