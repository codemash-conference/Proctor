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
            if(vm.session && vm.session.ProctorCheckIns && _.filter(vm.session.ProctorCheckIns, function(proctor){
                                                    return proctor.UserId === userService.user().UserId; }).length > 0)
            {
                return "#666666";
            }

            return '#f67e00';
        }

        function proctorCheckInTime(){
            if(!vm.session){ return null;}
            var pt = _.find(vm.session.proctorCheckIns, function(p){
                return p.userId === userService.user().UserId;});
            if(pt){
                return moment(pt.CheckInTime).format("hh:mm a");
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
                vm.session.ActualSessionStartTime &&
                vm.session.ActualSessionStartTime !== "") {
                return "#666666";
            }
            return '#f67e00';
        }

        function endTimeStatusColor() {
            if (vm.session &&
                vm.session.ActualSessionEndTime &&
                vm.session.ActualSessionEndTime.SessionEndTime !== "") {
                return "#666666";
            }
            return '#f67e00';
        }

        function checkIn() {
            var proctor = _.find(vm.session.ProctorCheckIns, function(p){
                return p.UserId === userService.user().UserId;});

            if(!proctor) {

                var userCheckIn = {
                    SessionId: vm.session.Id,
                    UserId: userService.user().UserId,
                    CheckInTime: moment().format("M/D/YYYY hh:mm a")
                };
                vm.session.ProctorCheckIns.push(userCheckIn);
                saveCheckInInfo();
            }
        }

        function startSession() {
            if(!vm.session.ActualSessionStartTime) {
                vm.session.ActualSessionStartTime = moment().format("M/D/YYYY hh:mm a");
                saveCheckInInfo();
            }
        }

        function endSession() {
            if(!vm.session.ActualSessionEndTime) {
                vm.session.ActualSessionEndTime = moment().format("M/D/YYYY hh:mm a");
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
            var attendanceCount = type === '10In' ? vm.session.Attendees10 : vm.session.Attendees50;
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
                        vm.session.Attendees10 = count;
                    }
                    else{
                        vm.session.Attendees50 = count;
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
