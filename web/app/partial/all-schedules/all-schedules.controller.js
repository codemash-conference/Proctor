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

        activate();

        function activate() {
            getSessionsPerUser();
        }

        function getSessionsPerUser() {
            sessionService.getSessionsPerUser().then(function(data){
                vm.users = _.filter(data, function (user) {
                    return user.sessions.length > 0;
                });

                if(vm.users.length>0) {
                    vm.users = _.forEach(vm.users, function (user) {
                        user.sessions = _.chain(user.sessions)
                            .sortBy(function(session) { return session.sessionStartTime; })
                            .groupBy(function (session) {
                                return moment(session.sessionStartTime).format("M/D/YY");})
                            .value();
                    });
                }
            });
        }
    }
})();
/* jshint +W117 */
