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
            if(vm.session && vm.session.proctorCheckIns && _.filter(vm.session.proctorCheckIns, function(proctor){
                    return proctor.userId === vm.proctor.id; }).length > 0)
            {
                return "#666666";
            }

            return '#f67e00';
        }

        function proctorCheckInTime(){
            if(!vm.session){ return null;}
            var proctor = _.first(vm.session.proctorCheckIns, function(proctor){
                return proctor.userId === vm.proctor.id;});
            if(proctor){
                return moment(proctor.checkInTime).format("hh:mm a");
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
            var userCheckIn = {
                sessionId: vm.session.id,
                userId: vm.proctor.id,
                checkInTime: moment().format("M/D/YYYY hh:mm a")
            };
            vm.session.proctorCheckIns.push(userCheckIn);
            saveCheckInInfo();
        }

        function startSession() {
            vm.session.actualSessionStartTime = moment().format("M/D/YYYY hh:mm a");
            saveCheckInInfo();
        }

        function endSession() {
            vm.session.actualSessionEndTime = moment().format("M/D/YYYY hh:mm a");
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
                    userId : function() { return vm.proctor.id; }
                }
            })
                .result.then(function(session) {
                    vm.session.actualSessionEndTime = session.actualSessionEndTime;
                    vm.session.actualSessionStartTime = session.actualSessionStartTime;

                    var proctor = _.first(vm.session.proctorCheckIns, function(proctor){
                                        return proctor.userId === vm.proctor.id;});
                    var proctor2 = _.first(session.proctorCheckIns, function(proctor){
                                        return proctor.userId === vm.proctor.id;});
                    if(proctor) {
                        proctor.checkInTime = proctor2.checkInTime;
                    }
                saveCheckInInfo();
            });
        }
    }
})();
/* jshint +W117 */
/* jshint +W072 */
