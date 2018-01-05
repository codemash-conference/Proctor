/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('EditScheduleExceptionController', EditScheduleExceptionController);

    function EditScheduleExceptionController($q, userService, logger, moment, scheduleExceptionService,
                                             $uibModalInstance, exception, isAdd) {
        var vm = this;
        vm.isAdd = isAdd;
        vm.title = 'Edit Schedule Exception';
        vm.users = [];
        vm.exceptionOrig = exception;
        vm.exception = angular.copy(exception);
        vm.ok = ok;
        vm.cancel = cancel;
        vm.selectedUser = null;
        vm.startTimeRaw = null;
        vm.endTimeRaw = null;

        activate();

        function activate() {
            vm.startTimeRaw = moment(vm.exception.startTime).toDate();
            vm.endTimeRaw = moment(vm.exception.endTime).toDate();
            getUsers();
        }

        function getUsers() {
            userService.getAllUsers().then(function (data) {
                vm.users = _.sortBy(data, function (user) {
                    return user.lastName + ', ' + user.firstName;
                });
                if(vm.exception.userId !== null)
                {
                    vm.selectedUser = _.find(vm.users, function (user) {
                        return user.id === vm.exception.userId;
                    });
                }
            });
        }
        function ok() {
            //TODO: Validation
            vm.exception.firstName = vm.selectedUser.firstName;
            vm.exception.lastName = vm.selectedUser.lastName;
            vm.exception.userId = vm.selectedUser.id;
            vm.exception.startTime = moment(vm.startTimeRaw).format("M/D/YYYY hh:mm a");
            vm.exception.endTime = moment(vm.endTimeRaw).format("M/D/YYYY hh:mm a");

            if(isAdd){
                scheduleExceptionService.createException(vm.exception).then(function (response) {
                    $uibModalInstance.close(response.data);
                });
            }
            else {
                scheduleExceptionService.updateException(vm.exception).then(function (response) {
                        vm.exceptionOrig.firstName = vm.exception.firstName;
                        vm.exceptionOrig.lastName = vm.exception.lastName;
                        vm.exceptionOrig.userId = vm.exception.userId;
                        vm.exceptionOrig.startTime = vm.exception.startTime;
                        vm.exceptionOrig.endTime = vm.exception.endTime;
                        $uibModalInstance.close();
                    },
                    function (response) {
                        //error
                    });
            }

        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
/* jshint +W117 */
