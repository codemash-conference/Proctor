/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ImportUsersController', ImportUsersController);

    function ImportUsersController($q, salesService, logger, moment, userService,
                                   $uibModalInstance, $filter, $timeout) {
        var vm = this;
        vm.title = 'Import Users';
        vm.fileContent = null;
        vm.users = null;
        vm.imported = false;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.importUsers = importUsers;
        vm.loadUsers = loadUsers;

        activate();

        function activate() {
        }

        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            if(vm.imported){
                $uibModalInstance.close(vm.imported);
            }
            else {
                $uibModalInstance.dismiss('cancel');
            }
        }

        function loadUsers() {
            $timeout(function(){vm.users = $filter('userCsvToObj')(vm.fileContent);}, 100);
        }

        function importUsers(){
            vm.imported = true;
            _.forEach(vm.users, function(user){

                userService.createUser(user).then(function (response) {
                    user.imported = true;
                });
            });
            logger.success('Users Imported', 'Success');
        }
    }
})();
/* jshint +W117 */
