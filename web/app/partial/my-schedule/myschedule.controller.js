/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('MyScheduleController', MyScheduleController);

    function MyScheduleController($q, sessionService, logger, userService, moment) {
        var vm = this;
        vm.title = 'My Schedule';
        vm.schedule = [];

        activate();

        function activate() {
            getMySchedule();
        }

        function getMySchedule() {
            sessionService.getUserSchedule(userService.user().userId).then(
                function (data) {
                    vm.schedule = data;
                    vm.schedule.Sessions = _.chain(vm.schedule.Sessions)
                        .sortBy(function(session) { return session.SessionStartTime; })
                        .groupBy(function (session) {
                            return moment(session.SessionStartTime).format("M/D/YY");})
                        .value();
                }
            );
        }
    }
})();
/* jshint +W117 */
