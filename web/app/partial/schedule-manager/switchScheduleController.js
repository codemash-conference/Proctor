/* jshint -W117 */
'use strict';
(function () {

    angular
        .module('app.partial')
        .controller('SwitchScheduleController', SwitchScheduleController);

    function SwitchScheduleController($uibModalInstance, session, userService, sessionService, moment) {
        var vm = this;

        vm.ok = ok;
        vm.cancel = cancel;
        vm.session = session;
        vm.users = [];
        vm.userToSwitchWith = null;
        vm.sessionsToSwitch = [];
        vm.forSession = null;
        vm.options = [{value : 1, text: 'Give' },{value : 2, text: 'Switch' }];
        vm.optionValue = {value : 2, text: 'Switch' };

        vm.userChanged = userChanged;
        vm.save = save;
        vm.groupByDate = groupByDate;
        activate();

        function activate() {
            getUsers();
        }

        function getUsers() {

            userService.getAllUsers().then(function (data) {
                vm.users = data;
            });
        }

        function userChanged(x,y){
            if(vm.optionValue.value === 2) {
                sessionService.getUserSchedule(vm.userToSwitchWith.Id).then(
                    function (data) {
                        vm.sessionsToSwitch = _.sortBy(_.filter(data.Sessions,
                            function(s){ return s.VolunteersRequired !== 99; }),
                            function (t) {
                                return t.SessionStartTime;
                            });

                        _.forEach(vm.sessionsToSwitch, function (session) {
                            session.SessionStartTimeFmt = moment(session.SessionStartTime).format('h:mm a');
                            session.SessionEndTimeFmt = moment(session.SessionEndTime).format('h:mm a');
                        });
                    }
                );
            }
            else{
                vm.sessionsToSwitch = [];
            }
        }

        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {

        }

        function groupByDate(session) {
            return moment(session.SessionStartTime).format("M/D/YY");

        }
    }
})();
/* jshint +W117 */
