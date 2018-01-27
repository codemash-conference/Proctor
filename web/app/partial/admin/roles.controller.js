(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('RolesController', RolesController);

    function RolesController(logger, roleService, userService) {
        var vm = this;
        vm.title = 'Roles';
        vm.roles = [];
        vm.users = [];
        vm.allUsers = [];
        vm.currentRole = null;

        vm.selectRole = selectRole;
        vm.addUserToRole = addUserToRole;
        vm.removeUserFromRole = removeUserFromRole;

        activate();

        function activate() {
            //logger.info('Activated Group View');
            getRoles();
            getAllUsers();
        }

        function getRoles(){
            roleService.getRoles().then(function(data){
                vm.roles = data;
            });
        }

        function getAllUsers() {
            userService.getAllUsers().then(function (data) {
                vm.allUsers = data;
            });
        }

        function selectRole(role) {
            vm.currentRole = role;
            roleService.getUsersForRole(role.Id).then(function (data) {
                vm.users = data;
            });
        }

        function addUserToRole(user) {
            userService.addUserToRole(user.Id, vm.currentRole.Id).then(function(data){
                logger.success("Added user " + user.UserName);
            });

        }

        function removeUserFromRole(user) {
            userService.removeUserFromRole(user.Id, vm.currentRole.Id).then(function(data){
                logger.success("Removed user " + user.UserName);
            });
        }
    }
})();
