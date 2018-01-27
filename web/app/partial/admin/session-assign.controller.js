/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('SessionAssignController', SessionAssignController);

    function SessionAssignController($q, logger, moment, userService, sessionService,
                                   $uibModalInstance, selectedSession, availableUsers) {
        var vm = this;
        vm.title = 'Assign Users to Session';
        vm.session = selectedSession;
        vm.users = availableUsers;
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

        }



        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function removeUserFromSession(item) {
            sessionService.removeUserFromSession(vm.session.Id, item.Id).then(function(response) {
                logger.success('Removed user from session');
            });
        }

        function addUserToSession(item) {
            sessionService.addUserToSession(vm.session.Id, item.Id).then(function(response) {
                logger.success('Added user from session');
            });

        }

        function addAllUsers() {
            vm.usersLoaded = [];
            _.forEach(vm.users, function(user){
               if(!_.find(vm.session.Assignees, function(assignee){ return assignee.Id === user.Id; })){
                   sessionService.addUserToSession(vm.session.Id, user.Id).then(function(response) {
                       vm.session.Assignees.push(user);
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
                var assign = _.find(vm.session.Assignees, function(assignee){ return assignee.Id === user.Id; });
                if(assign){
                    sessionService.removeUserFromSession(vm.session.Id, user.Id).then(function(response) {
                        var index = vm.session.Assignees.indexOf(assign);
                        vm.session.Assignees.splice(index, 1);
                    });
                }
            });
        }

    }
})();
/* jshint +W117 */
