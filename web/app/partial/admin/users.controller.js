(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('UsersController', UsersController);

    function UsersController($q, messageBox, logger, userService, DTOptionsBuilder, DTColumnDefBuilder, $uibModal) {
        var vm = this;
        vm.title = 'User';
        vm.users = [];


        vm.deleteUser = deleteUser;
        vm.updateUser = updateUser;
        vm.addUser = addUser;
        vm.importUsers = importUsers;

        activate();

        vm.dtOptions3 = DTOptionsBuilder.newOptions()
            .withDOM("<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp")
            .withButtons([
                {extend: 'csv',title: 'Users', className: 'btn-sm'},
                {extend: 'pdf', title: 'Users', className: 'btn-sm'},
                {extend: 'print',className: 'btn-sm'}
            ]);
        vm.columns = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5)
        ];

        function activate() {
            getUsers();
        }

        function getUsers() {
            userService.getAllUsers().then(function (data) {
                vm.users = data;
            });
        }

        function deleteUser(user) {
            messageBox.confirmDialog('Delete User', 'Are you sure you want to delete this user?', function () {
                userService.deleteUser(user.id).then(function(){
                    getUsers();
                });
            });
        }

        function addUser() {
            var user = userService.getNewUserObj();
            $uibModal.open({
                templateUrl: 'app/partial/admin/edituser.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    'user' : user,
                    'isAdd' : true
                }
            })
                .result.then(function() {
                logger.success('User Updated', 'Success');
            });

        }

        function updateUser(user) {
            $uibModal.open({
                templateUrl: 'app/partial/admin/edituser.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    'user' : user,
                    'isAdd' : false
                }
            })
                .result.then(function() {
                logger.success('User Updated', 'Success');
            });
        }

        function importUsers() {
            $uibModal.open({
                templateUrl: 'app/partial/admin/import-users.html',
                controller: 'ImportUsersController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {}
            })
                .result.then(function() {
                logger.success('Users Imported', 'Success');
            });
        }


    }
})();
