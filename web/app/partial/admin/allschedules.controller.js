/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('AllSchedulesController', AllSchedulesController);

    function AllSchedulesController($q, sessionService, logger, moment) {
        var vm = this;
        vm.title = 'User';
        vm.users = [];

        activate();

        function activate() {
            getSessionsPerUser();
        }

        function getSessionsPerUser() {
            sessionService.getSessionsPerUser().then(function(data){
                vm.users = _.forEach(data, function (user) {
                    user.sessions = _.chain(user.sessions)
                        .sortBy(function(session) { return session.sessionStartTime; })
                        .groupBy(function (session) {
                            return moment(session.sessionStartTime).format("M/D/YY");})
                        .value();
                });
            });
        }
    }
})();
/* jshint +W117 */
