/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ScheduleManagerController', ScheduleManagerController);

    function ScheduleManagerController($q, sessionService, logger, userService, moment) {
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
                }
            );
        }
    }
})();
/* jshint +W117 */
