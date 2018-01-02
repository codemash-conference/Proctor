/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('AttendancePickerController', AttendancePickerController);

    function AttendancePickerController($q, $uibModalInstance, sessionAttendance) {
        var vm = this;
        vm.title = 'Attendance Picker';
        vm.sessionAttendance = sessionAttendance;
        vm.ok = ok;
        vm.numberSelected = numberSelected;
        vm.pick = pick;

        activate();

        function activate() {
        }

        function ok() {
            $uibModalInstance.close(vm.sessionAttendance);
        }

        function pick(number) {
            var num = number.toString();
            var oldNum = vm.sessionAttendance.toString().padZero(3).split('');
            oldNum[3 - num.length] = oldNum[3 - num.length] === num[0] ? '0' : num[0];
            vm.sessionAttendance = parseInt(oldNum.join(''));
        }

        function numberSelected(num){
            var attNum = vm.sessionAttendance;
            var numArray = num.toString().split('');
            var attNumArray = attNum.toString().padZero(3).split('');

            if (numArray[0] === attNumArray[3 - numArray.length]) { return 'selected'; }
            return '';
        }


    }
})();
/* jshint +W117 */
