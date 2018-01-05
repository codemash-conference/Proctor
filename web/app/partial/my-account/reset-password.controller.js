(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ResetPasswordController', ResetPasswordController);

    function ResetPasswordController($q, userService, logger, $uibModalInstance ) {
        var vm = this;
        vm.title = 'Reset Password';
        vm.resetPassword = {
            oldPassword : '',
            newPassword : '',
            newPasswordConfirm : '',
            userId : userService.user().userId
        };
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() {
        }

        function ok() {
            //TODO: Validation

            userService.resetPassword(vm.resetPassword).then(function (response) {
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
