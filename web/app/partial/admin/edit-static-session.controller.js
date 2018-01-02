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
                vm.session.sessionStartTimeRaw = moment(vm.session.sessionStartTime).toDate();
                vm.session.sessionEndTimeRaw = moment(vm.session.sessionEndTime).toDate();
            }
        }

        function getRooms() {
            sessionService.getRooms().then(function (data) {
                vm.rooms = data;
            });
        }

        function ok() {
            //TODO: Validation
            vm.session.sessionStartTime = moment(vm.session.sessionStartTimeRaw).format("M/D/YYYY HH:mm:ss");
            vm.session.sessionEndTime = moment(vm.session.sessionEndTimeRaw).format("M/D/YYYY HH:mm:ss");
            vm.session.roomString =  _.map(
                _.sortBy(vm.session.rooms,function(room) { return room.name;}),
                'name')
                .join(',');

            if(isAdd){
                sessionService.createSession(vm.session).then(function (response) {
                    $uibModalInstance.close(response);
                });
            }
            else {
                sessionService.updateSession(vm.session).then(function (response) {
                        vm.sessionOrig.sessionStartTime = vm.session.sessionStartTime;
                        vm.sessionOrig.sessionEndTime = vm.session.sessionEndTime;
                        vm.sessionOrig.volunteersRequired = vm.session.volunteersRequired;
                        vm.sessionOrig.abstract = vm.session.abstract;
                        vm.sessionOrig.title = vm.session.title;
                        vm.sessionOrig.rooms = vm.session.rooms;
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
