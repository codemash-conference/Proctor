/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('SessionAssignController', SessionAssignController);

    function SessionAssignController($q, logger, moment, userService,
                                   $uibModalInstance, selectedSession, roleService) {
        var vm = this;
        vm.title = 'Assign Users to Session';
        vm.session = selectedSession;
        vm.users = [];
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() {
            getAvailableVolunteers();
        }

        function getAvailableVolunteers(role) {

            roleService.getUsersForRole(2).then(function (data) {
                vm.users = data;
            });
        }

        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();
/* jshint +W117 */
