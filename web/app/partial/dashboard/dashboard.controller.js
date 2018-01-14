/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('DashboardController', DashboardController);

    function DashboardController($q, $scope, sessionService, logger, moment, $interval, $window, $uibModal) {
        var vm = this;
        vm.title = 'Dashboard';
        vm.sessions = [];
        vm.dashboardTimer = null;
        vm.lastUpdateTime = moment().format("M/D/YY h:mm:ss a");

        vm.getProctorStatus = getProctorStatus;
        vm.isCheckedIn = isCheckedIn;
        vm.checkedInClass = checkedInClass;
        vm.getColumnSize = getColumnSize;
        vm.impersonateCheckIn = impersonateCheckIn;

        activate();

        $scope.$on("$destroy", function() {
            if (vm.dashboardTimer) { $interval.cancel(vm.dashboardTimer); }
            $window.Pace.options.ajax.ignoreURLs = [];
        });

        function activate() {
            $window.Pace.options.ajax.ignoreURLs = ['/api/Sessions'];
            getSessions();
            vm.dashboardTimer = $interval(getSessions, 5000);
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var parsed = _.chain(data)
                    .filter(function(session) {
                        return session.sessionType === 'General Session' ||
                            session.sessionType === 'Pre-Compiler' ||
                            session.sessionType === 'Static Session' ||
                            session.sessionType === 'Sponsor Session' ;
                    })
                    .filter(function(session) {
                        return moment(session.sessionStartTime).format("MM/DD/YYYY") === moment().format("MM/DD/YYYY");//'01/12/2018';
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
                proctorString += 'text-success';
            }
            else {
                proctorString += 'text-muted';
            }

            return proctorString;
        }

        function isCheckedIn(session) {
            return session.proctorCheckIns.length > 0;
        }

        function checkedInClass(session) {
            if(session.proctorCheckIns.length === 0) { return  '';}
            if(session.assignees.length !== session.proctorCheckIns.length){
                return 'checkedInPartial';
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

        function getColumnSize(session) {
            if(session.assignees.length <= 3) { return '3';}
            if(session.assignees.length <= 6) { return '4';}
            return '12';
        }

        function impersonateCheckIn(session, proctor){
            $uibModal.open({
                templateUrl: 'app/partial/dashboard/check-in-impersonate.html',
                controller: 'CheckInImpersonateController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    sessionId: session.id,
                    proctor: proctor,
                    isImpersonate : true
                }
            })
                .result.then(function() {

            });
        }
    }
})();
/* jshint +W117 */
