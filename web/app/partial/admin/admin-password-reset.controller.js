(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('AdminPasswordResetController', AdminPasswordResetController);

    function AdminPasswordResetController($q, userService, logger, $uibModalInstance ,user ) {
        var vm = this;
        vm.title = 'Reset Password';
        vm.resetPassword = {
            oldPassword : '',
            newPassword : '',
            newPasswordConfirm : '',
            userId : user.id
        };
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() {
        }

        function ok() {
            //TODO: Validation

            userService.adminResetPassword(vm.resetPassword).then(function (response) {
                if(response.status === 200) {
                    logger.success("Password was reset successfully!");
                    $uibModalInstance.close(response);
                }
                else{
                    logger.error("Error resetting password: " + response.data.message);
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
