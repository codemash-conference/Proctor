/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('StaticScheduleController', StaticScheduleController);

    function StaticScheduleController($q, sessionService, logger, $uibModal, messageBox, $filter) {
        var vm = this;
        vm.title = 'User';
        vm.sessions = [];
        vm.importStaticSessions = importStaticSessions;
        vm.addSession = addSession;
        vm.updateSession = updateSession;
        vm.deleteSession = deleteSession;

        activate();

        function activate() {
            getStaticSessions();
        }

        function getStaticSessions() {
            sessionService.getSessions().then(function (data) {
               vm.sessions = _.chain(data)
                   .filter(function(session) { return session.SessionType.Name === 'Static Session';})
                   .sortBy(function (session) { return session.SessionStartTime;})
                   .forEach(function(session) {
                       session.roomString =  _.map(
                           _.sortBy(session.Rooms,function(room) { return room.Name;}),
                           'Name')
                           .join(',');
                   }).value();


            });
        }

        function importStaticSessions() {
            $uibModal.open({
                templateUrl: 'app/partial/admin/import-static-sessions.html',
                controller: 'ImportStaticSessionsController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {}
            })
                .result.then(function(imported) {
                    if(imported){
                        getStaticSessions();
                    }
            });
        }

        function addSession() {
            var session = sessionService.newSessionObj();
            $uibModal.open({
                templateUrl: 'app/partial/admin/edit-static-session.html',
                controller: 'EditStaticSessionController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    'session' : session,
                    'isAdd' : true
                }
            })
                .result.then(function(newSession) {
                    vm.sessions.push(newSession);
                newSession.SessionStartTime =
                    $filter('date')(moment(newSession.SessionStartTime).toDate(), 'M/d h:mm a');
                newSession.SessionEndTime =
                    $filter('date')(moment(newSession.SessionEndTime).toDate(), 'M/d h:mm a');

                    logger.success('Session Created', 'Success');
            });

        }

        function updateSession(session) {
            $uibModal.open({
                templateUrl: 'app/partial/admin/edit-static-session.html',
                controller: 'EditStaticSessionController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    'session' : session,
                    'isAdd' : false
                }
            })
                .result.then(function() {
                    session.SessionStartTime = $filter('date')(moment(session.SessionStartTime).toDate(), 'M/d h:mm a');
                    session.SessionEndTime = $filter('date')(moment(session.SessionEndTime).toDate(), 'M/d h:mm a');
                logger.success('Session Updated', 'Success');
            });
        }

        function deleteSession(session) {
            messageBox.confirmDialog('Delete Session', 'Are you sure you want to delete this session?', function () {
                sessionService.deleteSession(session.Id).then(function (response) {
                    logger.success("Session deleted");
                    getStaticSessions();
                });
            });
        }
    }
})();
/* jshint +W117 */
