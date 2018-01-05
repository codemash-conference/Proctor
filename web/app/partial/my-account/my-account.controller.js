/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('MyAccountController', MyAccountController);

    function MyAccountController($q, logger, userService, $uibModal, localStorageService) {
        var vm = this;
        vm.title = 'My Account';
        vm.user = null;

        vm.ok = ok;
        vm.resetPassword = resetPassword;

        activate();

        function activate() {
            getUser();
        }

        function getUser(){
            userService.getUserById(userService.user().userId).then(function (data) {
                vm.user = data;
            });
        }
        function ok() {

            userService.updateUser(vm.user).then(function (response) {
                   //userService.user()
                    localStorageService.set('email', vm.user.email);
                    localStorageService.set('firstName', vm.user.firstName);
                    localStorageService.set('lastName', vm.user.lastName);
                    localStorageService.set('gravatar', vm.user.gravatar);
                    localStorageService.set('cell', vm.user.cellNumber);
                    localStorageService.set('userId', vm.user.id);
                    localStorageService.set('userObj', vm.user);
                   logger.success("Saved my account settings.");
                },
                function (response) {
                    //error
                });
        }

        function resetPassword() {
            $uibModal.open({
                templateUrl: 'app/partial/my-account/reset-password.html',
                controller: 'ResetPasswordController',
                controllerAs: 'vm',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
                resolve: {

                }
            })
                .result.then(function() {

            });
        }
    }
})();
/* jshint +W117 */
