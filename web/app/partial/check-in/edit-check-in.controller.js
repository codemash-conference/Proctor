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
            if(vm.session.actualSessionStartTime){
                vm.sessionStartTimeRaw = moment(vm.session.actualSessionStartTime).toDate();
            }
            if(vm.session.actualSessionEndTime) {
                vm.sessionEndTimeRaw = moment(vm.session.actualSessionEndTime).toDate();
            }
            var proctor = _.first(vm.session.proctorCheckIns, function(proctor){
                return proctor.userId === vm.userId;});

            if(proctor){
                vm.proctorCheckInTimeRaw = moment(proctor.checkInTime).toDate();
            }
        }

        function ok() {
            if(moment(vm.sessionStartTimeRaw).isValid()) {
                vm.origSession.actualSessionStartTime = moment(vm.sessionStartTimeRaw).format("M/D/YYYY HH:mm:ss");
            } else { vm.origSession.actualSessionStartTime = null; }

            if(moment(vm.sessionEndTimeRaw).isValid()) {
                vm.origSession.actualSessionEndTime = moment(vm.sessionEndTimeRaw).format("M/D/YYYY HH:mm:ss");
            } else { vm.origSession.actualSessionEndTime = null;}

            var proctor = _.first(vm.origSession.proctorCheckIns, function(proctor){
                return proctor.userId === vm.userId;});

            if(moment(vm.proctorCheckInTimeRaw).isValid()) {
                proctor.checkInTime = moment(vm.proctorCheckInTimeRaw).format("M/D/YYYY HH:mm:ss");
            } else { proctor.checkInTime = null; }

            $uibModalInstance.close(vm.origSession);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }

    }
})();
/* jshint +W117 */
