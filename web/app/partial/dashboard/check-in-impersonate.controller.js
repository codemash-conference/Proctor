/* jshint -W117 */
/* jshint -W072 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('CheckInImpersonateController', CheckInImpersonateController);

    function CheckInImpersonateController($q, logger, moment, $state, sessionService,
                               userService, $interval, $scope, $uibModal, sessionId, proctor, $uibModalInstance) {
        var vm = this;
        vm.title = 'Check In';

        vm.sessionId = sessionId;
        vm.session = null;
        vm.checkInTimer = null;
        vm.proctor = proctor;


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
        vm.ok = ok;
        vm.editCheckInInfo = editCheckInInfo;

        activate();

        $scope.$on("$destroy", function() {
            if (vm.checkInTimer) { $interval.cancel(vm.checkInTimer); }
        });

        function activate() {
            getCurrentSession();
            vm.checkInTimer = $interval(getCurrentSession, 5000);
        }

        function getCurrentSession() {
            sessionService.getSessionById(vm.sessionId).then(function (data) {
                vm.session = data;
            });
        }

        function checkInStatusColor() {
            if(vm.session && vm.session.ProctorCheckIns && _.filter(vm.session.ProctorCheckIns, function(proctor){
                    return proctor.UserId === vm.proctor.Id; }).length > 0)
            {
                return "#666666";
            }

            return '#f67e00';
        }

        function proctorCheckInTime(){
            if(!vm.session){ return null;}
            var proctor = _.first(vm.session.ProctorCheckIns, function(proctor){
                return proctor.UserId === vm.proctor.Id;});
            if(proctor){
                return moment(proctor.CheckInTime).format("hh:mm a");
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
            var userCheckIn = {
                sessionId: vm.session.Id,
                userId: vm.proctor.Id,
                checkInTime: moment().format("M/D/YYYY hh:mm a"),
                SessionId: vm.session.Id,
                UserId: vm.proctor.Id,
                CheckInTime: moment().format("M/D/YYYY hh:mm a")

            };
            vm.session.ProctorCheckIns.push(userCheckIn);
            saveCheckInInfo();
        }

        function startSession() {
            vm.session.ActualSessionStartTime = moment().format("M/D/YYYY hh:mm a");
            saveCheckInInfo();
        }

        function endSession() {
            vm.session.ActualSessionEndTime = moment().format("M/D/YYYY hh:mm a");
            saveCheckInInfo();
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

        function ok() {
            $uibModalInstance.close();
        }

        function editCheckInInfo() {
            $uibModal.open({
                templateUrl: 'app/partial/check-in/edit-check-in.html',
                controller: 'EditCheckInController',
                controllerAs: 'vm',
                size: 'md',
                resolve: {
                    session : vm.session,
                    userId : function() { return vm.proctor.Id; }
                }
            })
                .result.then(function(session) {
                    vm.session.ActualSessionEndTime = session.ActualSessionEndTime;
                    vm.session.ActualSessionStartTime = session.ActualSessionStartTime;

                    var proctor = _.first(vm.session.ProctorCheckIns, function(proctor){
                                        return proctor.UserId === vm.proctor.Id;});
                    var proctor2 = _.first(session.ProctorCheckIns, function(proctor){
                                        return proctor.UserId === vm.proctor.Id;});
                    if(proctor) {
                        proctor.CheckInTime = proctor2.CheckInTime;
                    }
                saveCheckInInfo();
            });
        }
    }
})();
/* jshint +W117 */
/* jshint +W072 */
