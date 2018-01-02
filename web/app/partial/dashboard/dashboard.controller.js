/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('DashboardController', DashboardController);

    function DashboardController($q, $scope, sessionService, logger, moment, $interval) {
        var vm = this;
        vm.title = 'Dashboard';
        vm.sessions = [];
        vm.dashboardTimer = null;
        vm.lastUpdateTime = moment().format("M/D/YY h:mm:ss a");

        vm.getProctorStatus = getProctorStatus;
        vm.isCheckedIn = isCheckedIn;
        vm.checkedInClass = checkedInClass;

        activate();

        $scope.$on("$destroy", function() {
            if (vm.dashboardTimer) { $interval.cancel(vm.dashboardTimer); }
        });

        function activate() {
            getSessions();
            vm.checkInTimer = $interval(getSessions, 10000);
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var parsed = _.chain(data)
                    .filter(function(session) {
                        return session.sessionType === 'General Session' ||
                            session.sessionType === 'Pre-Compiler' ||
                            session.sessionType === 'Static Session';
                    })
                    .filter(function(session) {
                        return moment(session.sessionStartTime).format("MM/DD/YYYY") === '01/11/2018';
                    })
                    .sortBy(function(session) { return session.sessionStartTime; })
                    .forEach(function(session) {
                        session.roomString =  _.map(
                            _.sortBy(session.rooms,function(room) { return room.name;}),
                            'name')
                            .join(',');
                    })
                    .groupBy(function(session) { return moment(session.sessionStartTime).format('h:mm A'); })
                    .value();
                vm.lastUpdateTime = moment().format("M/D/YY h:mm:ss a");
                vm.sessions = parsed;
            });
        }

        function getProctorStatus(session, proctor) {
            var proctorString = '';

            if(_.find(session.proctorCheckIns, {userId:proctor.id})) {
                proctorString += '<div>&#9745; ' + proctor.lastName + ', ' + proctor.firstName + '</div>';
            }
            else {
                proctorString += '<div>&#9744; ' + proctor.lastName + ', ' + proctor.firstName + '</div>';
            }

            return proctorString;
        }

        function isCheckedIn(session) {
            return session.proctorCheckIns.length > 0;
        }

        function checkedInClass(session) {
            if(session.assignees.length !== session.proctorCheckIns.length){
                if(getSessionStatus(session) === 'Done') {
                    return 'checkedInDone';
                }
            }
            return 'checkedIn';
        }

        function getSessionStatus(session){
            if (session.proctorCheckIns.length === 0) {
                return "Not Started";
            }
            else if (session.proctorCheckIns.length > 0 && session.actualSessionStartTime === null) {
                return "Checked In";
            }
            else if (session.proctorCheckIns.length > 0 && session.actualSessionStartTime !== null && session.actualSessionEndTime === null) {
                return "Started";
            }
            else {
                return "Done";
            }
        }

    }
})();
/* jshint +W117 */
