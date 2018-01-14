/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('CheckInController', CheckInController);

    function CheckInController($q, logger, moment, $state, sessionService,
                               userService, $interval, $scope, $uibModal) {
        var vm = this;
        vm.title = 'Check In';
        vm.sessionId = $state.params.sessionId;
        vm.session = null;
        vm.checkInTimer = null;
        vm.userId = null;

        vm.checkInStatusColor = checkInStatusColor;
        vm.startTimeStatusColor = startTimeStatusColor;
        vm.endTimeStatusColor = endTimeStatusColor;
        vm.checkIn = checkIn;
        vm.startSession = startSession;
        vm.endSession = endSession;
        vm.proctorCheckInTime = proctorCheckInTime;
        vm.formatDate = formatDate;
        vm.saveCheckInInfo = saveCheckInInfo;
        vm.pickAttendance = pickAttendance;
        vm.editCheckInInfo = editCheckInInfo;

        activate();

        $scope.$on("$destroy", function() {
            if (vm.checkInTimer) { $interval.cancel(vm.checkInTimer); }
        });

        function activate() {
            vm.userId = userService.user().userId;
            getCurrentSession();
            //vm.checkInTimer = $interval(getCurrentSession, 10000);
        }

        function getCurrentSession() {
            sessionService.getSessionById(vm.sessionId).then(function (data) {
                vm.session = data;
            });
        }

        function checkInStatusColor() {
            if(vm.session && vm.session.proctorCheckIns && _.filter(vm.session.proctorCheckIns, function(proctor){
                                                    return proctor.userId === userService.user().userId; }).length > 0)
            {
                return "#666666";
            }

            return '#f67e00';
        }

        function proctorCheckInTime(){
            if(!vm.session){ return null;}
            var pt = _.find(vm.session.proctorCheckIns, function(p){
                return p.userId === userService.user().userId;});
            if(pt){
                return moment(pt.checkInTime).format("hh:mm a");
            }
            else{
                return null;
            }

        }

        function formatDate(dateToFormat) {
            if(moment(dateToFormat).isValid()) {
                return moment(dateToFormat).format("hh:mm a");
            }
            return '';
        }

        function startTimeStatusColor() {

            if (vm.session &&
                vm.session.actualSessionStartTime &&
                vm.session.actualSessionStartTime !== "") {
                return "#666666";
            }
            return '#f67e00';
        }

        function endTimeStatusColor() {
            if (vm.session &&
                vm.session.actualSessionEndTime &&
                vm.session.actualSessionEndTime.sessionEndTime !== "") {
                return "#666666";
            }
            return '#f67e00';
        }

        function checkIn() {
            var proctor = _.find(vm.session.proctorCheckIns, function(p){
                return p.userId === userService.user().userId;});

            if(!proctor) {

                var userCheckIn = {
                    sessionId: vm.session.id,
                    userId: userService.user().userId,
                    checkInTime: moment().format("M/D/YYYY hh:mm a")
                };
                vm.session.proctorCheckIns.push(userCheckIn);
                saveCheckInInfo();
            }
        }

        function startSession() {
            if(!vm.session.actualSessionStartTime) {
                vm.session.actualSessionStartTime = moment().format("M/D/YYYY hh:mm a");
                saveCheckInInfo();
            }
        }

        function endSession() {
            if(!vm.session.actualSessionEndTime) {
                vm.session.actualSessionEndTime = moment().format("M/D/YYYY hh:mm a");
                saveCheckInInfo();
            }
        }

        function saveCheckInInfo() {
            sessionService.updateSession(vm.session).then(
                function (response) {
                    logger.success("Updated session check in info");
                }
            );
        }

        function pickAttendance(type) {
            var attendanceCount = type === '10In' ? vm.session.attendees10 : vm.session.attendees50;
            $uibModal.open({
                templateUrl: 'app/partial/check-in/attendance-picker.html',
                controller: 'AttendancePickerController',
                controllerAs: 'vm',
                size: 'md',
                resolve: {
                    'sessionAttendance' : attendanceCount
                }
            })
                .result.then(function(count) {
                    if(type === '10In'){
                        vm.session.attendees10 = count;
                    }
                    else{
                        vm.session.attendees50 = count;
                    }
                    saveCheckInInfo();
            });
        }

        function editCheckInInfo() {
            $uibModal.open({
                templateUrl: 'app/partial/check-in/edit-check-in.html',
                controller: 'EditCheckInController',
                controllerAs: 'vm',
                size: 'md',
                resolve: {
                    session : vm.session,
                    userId : function() { return vm.userId; }
                }
            })
                .result.then(function(session) {
                saveCheckInInfo();
            });
        }
    }
})();
/* jshint +W117 */
