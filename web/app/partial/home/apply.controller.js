'use strict';
(function () {

    angular
        .module('app.partial')
        .controller('ApplyController', ApplyController);

    function ApplyController($uibModalInstance, userService) {
        var vm = this;
        vm.user  = {};
        vm.cancel = cancel;
        vm.submit = submit;
        activate();

        function activate() {
            vm.user = userService.getNewUserObj();
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }

        function submit(){
            userService.register(vm.user).then(function (data){
                //Log in and give status
            });
        }
    }
})();
