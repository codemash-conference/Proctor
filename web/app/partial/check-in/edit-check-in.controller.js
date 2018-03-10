/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('EditCheckInController', EditCheckInController);

    function EditCheckInController($q, $uibModalInstance, session, userId) {
        var vm = this;
        vm.title = 'Edit Check In';
        vm.userId = userId;
        vm.origSession = session;
        vm.session = angular.copy(session);
        vm.sessionStartTimeRaw = null;
        vm.sessionEndTimeRaw = null;
        vm.proctorCheckInTimeRaw = null;
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() {
            if(vm.session.ActualSessionStartTime){
                vm.sessionStartTimeRaw = moment(vm.session.ActualSessionStartTime).toDate();
            }
            if(vm.session.ActualSessionEndTime) {
                vm.sessionEndTimeRaw = moment(vm.session.ActualSessionEndTime).toDate();
            }
            var proctor = _.first(vm.session.ProctorCheckIns, function(proctor){
                return proctor.UserId === vm.userId;});

            if(proctor){
                vm.proctorCheckInTimeRaw = moment(proctor.CheckInTime).toDate();
            }
        }

        function ok() {
            if(moment(vm.sessionStartTimeRaw).isValid()) {
                vm.origSession.ActualSessionStartTime = moment(vm.sessionStartTimeRaw).format("M/D/YYYY HH:mm:ss");
            } else { vm.origSession.ActualSessionStartTime = null; }

            if(moment(vm.sessionEndTimeRaw).isValid()) {
                vm.origSession.ActualSessionEndTime = moment(vm.sessionEndTimeRaw).format("M/D/YYYY HH:mm:ss");
            } else { vm.origSession.ActualSessionEndTime = null;}

            var proctor = _.first(vm.origSession.ProctorCheckIns, function(proctor){
                return proctor.UserId === vm.userId;});

            if(moment(vm.proctorCheckInTimeRaw).isValid()) {
                proctor.CheckInTime = moment(vm.proctorCheckInTimeRaw).format("M/D/YYYY HH:mm:ss");
            } else { proctor.CheckInTime = null; }

            $uibModalInstance.close(vm.origSession);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }

    }
})();
/* jshint +W117 */
