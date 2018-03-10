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
                    user.Sessions = _.chain(user.Sessions)
                        .sortBy(function(session) { return session.SessionStartTime; })
                        .groupBy(function (session) {
                            return moment(session.SessionStartTime).format("M/D/YY");})
                        .value();
                });
            });
        }
    }
})();
/* jshint +W117 */
