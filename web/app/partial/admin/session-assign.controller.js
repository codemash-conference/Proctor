/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('SessionAssignController', SessionAssignController);

    function SessionAssignController($q, logger, moment, userService, sessionService,
                                   $uibModalInstance, selectedSession, roleService) {
        var vm = this;
        vm.title = 'Assign Users to Session';
        vm.session = selectedSession;
        vm.users = [];
        vm.loading = false;
        vm.status = '';
        vm.usersLoaded = [];

        vm.ok = ok;
        vm.cancel = cancel;
        vm.addUserToSession = addUserToSession;
        vm.removeUserFromSession = removeUserFromSession;
        vm.addAllUsers = addAllUsers;
        vm.removeAllUsers = removeAllUsers;

        activate();

        function activate() {
           getAvailableVolunteers();
        }

        function getAvailableVolunteers(role) {

            roleService.getUsersForRoleName('Everyone').then(function (data) {
                vm.users = _.sortBy(data,function(user){ return user.lastName + ', ' + user.firstName; });
            });
        }

        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function removeUserFromSession(item) {
            sessionService.removeUserFromSession(vm.session.id, item.id).then(function(response) {
                logger.success('Removed user from session');
            });
        }

        function addUserToSession(item) {
            sessionService.addUserToSession(vm.session.id, item.id).then(function(response) {
                logger.success('Added user from session');
            });

        }

        function addAllUsers() {
            vm.usersLoaded = [];
            _.forEach(vm.users, function(user){
               if(!_.find(vm.session.assignees, function(assignee){ return assignee.id === user.id; })){
                   sessionService.addUserToSession(vm.session.id, user.id).then(function(response) {
                       vm.session.assignees.push(user);
                       vm.usersLoaded.push(user);
                   });
               }
               else{
                   vm.usersLoaded.push(user);
               }
            });
        }

        function removeAllUsers() {
            _.forEach(vm.users, function(user){
                var assign = _.find(vm.session.assignees, function(assignee){ return assignee.id === user.id; });
                if(assign){
                    sessionService.removeUserFromSession(vm.session.id, user.id).then(function(response) {
                        var index = vm.session.assignees.indexOf(assign);
                        vm.session.assignees.splice(index, 1);
                    });
                }
            });
        }

    }
})();
/* jshint +W117 */
