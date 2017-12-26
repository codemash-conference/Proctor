(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('EditUserController', EditUserController);

    function EditUserController($q, userService, logger, moment, $uibModalInstance, user, isAdd) {
        var vm = this;
        vm.isAdd = isAdd;
        vm.title = 'Edit User';
        vm.userOrig = user;
        vm.user = angular.copy(user);
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() {
        }

        function ok() {
            //TODO: Validation

            if(isAdd){
                userService.createUser(vm.user).then(function (response) {
                    $uibModalInstance.close();
                });
            }
            else {
                userService.updateUser(vm.user).then(function (response) {
                        vm.userOrig.cellNumber = vm.user.cellNumber;
                        vm.userOrig.firstName = vm.user.firstName;
                        vm.userOrig.lastName = vm.user.lastName;
                        vm.userOrig.email = vm.user.email;
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
