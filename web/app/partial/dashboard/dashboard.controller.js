/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('DashboardController', DashboardController);

    function DashboardController($q, $scope, sessionService, logger, moment, $interval, $window, $uibModal, roleService) {
        var vm = this;
        vm.title = 'Dashboard';
        vm.sessions = [];
        vm.dashboardTimer = null;
        vm.lastUpdateTime = moment().format("M/D/YY h:mm:ss a");
        vm.users = [];

        vm.getProctorStatus = getProctorStatus;
        vm.isCheckedIn = isCheckedIn;
        vm.checkedInClass = checkedInClass;
        vm.getColumnSize = getColumnSize;
        vm.impersonateCheckIn = impersonateCheckIn;
        vm.reassignSession = reassignSession;

        activate();

        $scope.$on("$destroy", function() {
            if (vm.dashboardTimer) { $interval.cancel(vm.dashboardTimer); }
            $window.Pace.options.ajax.ignoreURLs = [];
        });

        function activate() {
            $window.Pace.options.ajax.ignoreURLs = ['/api/Sessions'];
            getSessions();
            getAvailableVolunteers();
            vm.dashboardTimer = $interval(getSessions, 5000);
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var parsed = _.chain(data)
                    .filter(function(session) {
                        return session.SessionType.Name === 'General Session' ||
                            session.SessionType.Name === 'Pre-Compiler' ||
                            session.SessionType.Name === 'PreCompiler' ||
                            session.SessionType.Name === 'Static Session' ||
                            session.SessionType.Name === 'Sponsor Session' ;
                    })
                    .filter(function(session) {
                        return moment(session.SessionStartTime).format("MM/DD/YYYY") === moment().format("MM/DD/YYYY");//'01/12/2018';
                    })
                    .sortBy(function(session) { return session.SessionStartTime; })
                    .forEach(function(session) {
                        session.roomString =  _.map(
                            _.sortBy(session.Rooms,function(room) { return room.Name;}),
                            'Name')
                            .join(',');
                    })
                    .groupBy(function(session) { return moment(session.SessionStartTime).format('h:mm A'); })
                    .value();
                vm.lastUpdateTime = moment().format("M/D/YY h:mm:ss a");
                vm.sessions = parsed;
            });
        }

        function getProctorStatus(session, proctor) {
            var proctorString = '';

            if(_.find(session.ProctorCheckIns, {UserId:proctor.Id})) {
                proctorString += 'text-success';
            }
            else {
                proctorString += 'text-muted';
            }

            return proctorString;
        }

        function isCheckedIn(session) {
            return session.ProctorCheckIns.length > 0;
        }

        function checkedInClass(session) {
            if(session.ProctorCheckIns.length === 0) { return  '';}
            if(session.Assignees.length !== session.ProctorCheckIns.length){
                return 'checkedInPartial';
            }
            return 'checkedIn';
        }

        function getSessionStatus(session){
            if (session.ProctorCheckIns.length === 0) {
                return "Not Started";
            }
            else if (session.ProctorCheckIns.length > 0 && session.ActualSessionStartTime === null) {
                return "Checked In";
            }
            else if (session.ProctorCheckIns.length > 0 && session.ActualSessionStartTime !== null && session.ActualSessionEndTime === null) {
                return "Started";
            }
            else {
                return "Done";
            }
        }

        function getColumnSize(session) {
            if(session.Assignees.length <= 3) { return '3';}
            if(session.Assignees.length <= 6) { return '4';}
            return '12';
        }

        function impersonateCheckIn(session, proctor){
            $uibModal.open({
                templateUrl: 'app/partial/dashboard/check-in-impersonate.html',
                controller: 'CheckInImpersonateController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    sessionId: session.Id,
                    proctor: proctor,
                    isImpersonate : true
                }
            })
                .result.then(function() {

            });
        }


        function reassignSession(s){
            $uibModal.open({
                templateUrl: 'app/partial/admin/session-assign.html',
                controller: 'SessionAssignController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    selectedSession: s,
                    availableUsers: function() {return vm.users; }
                }
            })
                .result.then(function() {
                logger.success('Sessions assigned', 'Success');
            });
        }

        function getAvailableVolunteers() {

            roleService.getUsersForRoleName('Everyone').then(function (data) {
                vm.users = _.sortBy(data,function(user){ return user.LastName + ', ' + user.FirstName; });
            });
        }
    }
})();
/* jshint +W117 */
