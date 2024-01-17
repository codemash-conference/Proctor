/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('AllUsersSchedulesController', AllUsersSchedulesController);

    function AllUsersSchedulesController($q, sessionService, logger, moment) {
        var vm = this;
        vm.title = 'User';
        vm.users = [];
        vm.filter = '';
        vm.filterUsers = filterUsers;

        activate();

        function activate() {
            getSessionsPerUser();
        }

        function getSessionsPerUser() {
            sessionService.getSessionsPerUser().then(function(data){
                vm.users = _.filter(data, function (user) {
                    return user.Sessions.length > 0;
                });

                if(vm.users.length>0) {
                    vm.users = _.forEach(vm.users, function (user) {
                        user.Sessions = _.chain(user.Sessions)
                            .sortBy(function(session) { return session.SessionStartTime; })
                            .groupBy(function (session) {
                                return moment(session.SessionStartTime).format("M/D/YY");})
                            .value();
                    });
                }
            });
        }

        function filterUsers(){
            return function (row, idx) {
                var show = false;
                if(row.FirstName.toLowerCase().includes(vm.filter.toLowerCase()) || row.LastName.toLowerCase().includes(vm.filter.toLowerCase())){
                    show = true;
                }
                return show;
            };
        }
    }
})();
/* jshint +W117 */
