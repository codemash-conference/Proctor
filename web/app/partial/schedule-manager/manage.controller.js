/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ManageController', ManageController);

    function ManageController($q, sessionService, logger, userService, moment, $uibModal) {
        var vm = this;
        vm.title = 'Manage';
        vm.schedule = [];
        vm.sessions = [];

        vm.switchSession = switchSession;

        activate();

        function activate() {
            getMySchedule();
        }

        function getMySchedule() {
            sessionService.getUserSchedule(userService.user().userId).then(
                function (data) {
                    vm.schedule = data;
                    vm.schedule.sessions = _.chain(vm.schedule.Sessions)
                        .sortBy(function(session) { return session.SessionStartTime; })
                        .groupBy(function (session) {
                            return moment(session.SessionStartTime).format("M/D/YY");})
                        .value();
                }
            );
        }

        function switchSession(session) {
            $uibModal.open({
                templateUrl: 'app/partial/schedule-manager/switchSchedule.html',
                controller: 'SwitchScheduleController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    session: function(){ return session; }
                }
            })
                .result.then(function(imported) {

            });
        }
    }
})();
/* jshint +W117 */
