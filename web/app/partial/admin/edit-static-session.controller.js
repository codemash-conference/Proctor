/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('EditStaticSessionController', EditStaticSessionController);

    function EditStaticSessionController($q, sessionService, logger, moment, $uibModalInstance, session, isAdd) {
        var vm = this;
        vm.isAdd = isAdd;
        vm.title = 'Edit Static Session';
        vm.sessionOrig = session;
        vm.session = angular.copy(session);
        vm.rooms = [];
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() {
            getRooms();

            if(isAdd){
                vm.session.sessionStartTimeRaw = moment().toDate();
                vm.session.sessionEndTimeRaw = moment().toDate();
            }
            else
            {
                vm.session.sessionStartTimeRaw = moment(vm.session.SessionStartTime).toDate();
                vm.session.sessionEndTimeRaw = moment(vm.session.SessionEndTime).toDate();
            }
        }

        function getRooms() {
            sessionService.getRooms().then(function (data) {
                vm.rooms = data;
            });
        }

        function ok() {
            //TODO: Validation
            vm.session.SessionStartTime = moment(vm.session.sessionStartTimeRaw).format("M/D/YYYY HH:mm:ss");
            vm.session.SessionEndTime = moment(vm.session.sessionEndTimeRaw).format("M/D/YYYY HH:mm:ss");
            vm.session.roomString =  _.map(
                _.sortBy(vm.session.Rooms,function(room) { return room.Name;}),
                'Name')
                .join(',');
            vm.session.SessionTime = null;
            if(isAdd){
                sessionService.createSession(vm.session).then(function (response) {
                    $uibModalInstance.close(response);
                });
            }
            else {
                sessionService.updateSession(vm.session).then(function (response) {
                        vm.sessionOrig.SessionStartTime = vm.session.SessionStartTime;
                        vm.sessionOrig.SessionEndTime = vm.session.SessionEndTime;
                        vm.sessionOrig.VolunteersRequired = vm.session.VolunteersRequired;
                        vm.sessionOrig.Abstract = vm.session.Abstract;
                        vm.sessionOrig.Title = vm.session.Title;
                        vm.sessionOrig.Rooms = vm.session.Rooms;
                        vm.sessionOrig.roomString = vm.session.roomString;
                        $uibModalInstance.close();
                    },
                    function (response) {
                        //error
                    });
            }

        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
/* jshint +W117 */
