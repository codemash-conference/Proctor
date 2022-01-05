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
            vm.startTimeRaw = moment(vm.exception.StartTime).toDate();
            vm.endTimeRaw = moment(vm.exception.EndTime).toDate();
            getUsers();
        }

        function getUsers() {
            userService.getAllUsers().then(function (data) {
                vm.users = _.sortBy(data, function (user) {
                    return user.LastName + ', ' + user.FirstName;
                });
                if(vm.exception.UserId !== null)
                {
                    vm.selectedUser = _.find(vm.users, function (user) {
                        return user.Id === vm.exception.UserId;
                    });
                }
            });
        }
        function ok() {
            //TODO: Validation
            vm.exception.FirstName = vm.selectedUser.FirstName;
            vm.exception.LastName = vm.selectedUser.LastName;
            vm.exception.UserId = vm.selectedUser.Id;
            vm.exception.StartTime = moment(vm.startTimeRaw).format("M/D/YYYY hh:mm a");
            vm.exception.EndTime = moment(vm.endTimeRaw).format("M/D/YYYY hh:mm a");

            if(isAdd){
                scheduleExceptionService.createException(vm.exception).then(function (response) {
                    $uibModalInstance.close(response.data);
                });
            }
            else {
                scheduleExceptionService.updateException(vm.exception).then(function (response) {
                        vm.exceptionOrig.FirstName = vm.exception.FirstName;
                        vm.exceptionOrig.LastName = vm.exception.LastName;
                        vm.exceptionOrig.UserId = vm.exception.UserId;
                        vm.exceptionOrig.StartTime = vm.exception.StartTime;
                        vm.exceptionOrig.EndTime = vm.exception.EndTime;
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
