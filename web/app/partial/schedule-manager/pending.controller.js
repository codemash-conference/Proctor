/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('PendingController', PendingController);

    function PendingController($q, sessionService, logger, userService, moment) {
        var vm = this;
        vm.title = 'Pending';
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
