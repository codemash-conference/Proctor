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
                    $uibModalInstance.close(response.data);
                });
            }
            else {
                userService.updateUser(vm.user).then(function (response) {
                        vm.userOrig.CellNumber = vm.user.CellNumber;
                        vm.userOrig.FirstName = vm.user.FirstName;
                        vm.userOrig.LastName = vm.user.LastName;
                        vm.userOrig.Email = vm.user.Email;
                        vm.userOrig.UserName = vm.user.UserName;
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
