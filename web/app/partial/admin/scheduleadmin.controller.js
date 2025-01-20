/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ScheduleAdminController', ScheduleAdminController);

    function ScheduleAdminController($q, sessionService, logger, moment,
                                     $uibModal, roleService) {
        var vm = this;
        vm.title = 'User';
        vm.sessions = [];
        vm.currentDate = '';
        vm.dates = [];
        vm.rooms = [];
        vm.users = [];

        vm.importFeed = importFeed;
        vm.autoAssign = autoAssign;
        vm.sessionsByDateAndRoom = sessionsByDateAndRoom;
        vm.getCardState = getCardState;
        vm.getTop = getTop;
        vm.getHeight = getHeight;
        vm.editSessionAssignee = editSessionAssignee;

        activate();

        function activate() {
            getSessions();
            getAvailableVolunteers();
        }

        function importFeed() {
            sessionService.importSessionData().then(function(response){
                getSessions();
            });
        }
        function sessionsByDateAndRoom(cDate, room) {
            return _.filter(vm.sessions, function (session) {
               return cDate === moment(session.SessionStartTime).format("M/D/YY") &&
                   room === session.roomString;
            });
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var parsed = _.chain(data)
                    .filter(function(session) {
                        var room = session.Rooms[0] ? session.Rooms[0].name : '';
                        return session.SessionType.Name === 'General Session' ||
                            session.SessionType.Name === 'Pre-Compiler' ||
                            session.SessionType.Name === 'PreCompiler' ||
                            session.SessionType.Name === 'Static Session' ||
                            session.SessionType.Name === 'Sponsor Session' ||
                            session.SessionType.Name === 'Bytesized Breakouts';
                    })
                    .sortBy(function(session) { return session.SessionStartTime; })
                    .forEach(function(session) {
                        session.roomString =  _.map(
                                                _.sortBy(session.Rooms,function(room) { return room.Name;}),
                                                'Name')
                                                .join(',');
                        session.hasCollisions = function(){
                            var hasCollision = false;
                            var session = this;
                            _.forEach(this.Assignees, function(assignee){
                                var assigneeSchedule = _.filter(vm.sessions, function(session){
                                    return _.find(session.Assignees, function(a){
                                        return a.Id === assignee.Id;
                                    });
                                });
                                var collisionSession = null;
                                var collision = _.find(assigneeSchedule, function(session2){
                                    if(session.Id === session2.Id){ return false; }
                                    var sessionRange1 = moment.range(session.SessionStartTime, session.SessionEndTime);
                                    var sessionRange2 = moment.range(session2.SessionStartTime, session2.SessionEndTime);
                                    if (sessionRange1.overlaps(sessionRange2)) {collisionSession = session2;}
                                    return sessionRange1.overlaps(sessionRange2);
                                });
                                if(collision && session.VolunteersRequired !== 99 && collisionSession.VolunteersRequired !== 99) {
                                    hasCollision = true;
                                }


                            });
                            return hasCollision;
                        };
                    })
                    .value();

                vm.dates = _.chain(parsed).uniqBy(function(session) {
                    return moment(session.SessionStartTime).format("M/D/YY");
                })
                    .map(function(session){ return moment(session.SessionStartTime).format("M/D/YY");})
                    .value();

                vm.rooms = _.chain(parsed)
                    .uniqBy(function(session) {
                    return session.roomString;
                })
                    .sortBy(function(session){ return session.roomString;})
                    .map(function(session){ return session.roomString;})
                    .value();

                vm.currentDate = vm.dates[0];
                vm.sessions = parsed;
            });
        }

        function getCardState(session) {

            if(session.VolunteersRequired === 99)
            {
                return 'ok';
            }

            if(session.hasCollisions()){
                return 'error';
            }

            if(session.VolunteersRequired === 0 && session.Assignees.length > 0)
            {
                return 'ok';
            }

            if(session.VolunteersRequired >0 && session.Assignees.length >= session.VolunteersRequired)
            {
                return 'ok';
            }

            return '';
        }

        function getTop(session) {
            var x = moment.duration(moment(session.SessionStartTime).format('HH:mm')) / 60000;
            x = x - 375;
            return x.toString() + 'px';
        }

        function getHeight(session) {
            var x = moment.duration(moment(session.SessionStartTime).format('HH:mm')) / 60000;
            var y = moment.duration(moment(session.SessionEndTime).format('HH:mm')) / 60000;
            var z = (y - x);
            return z.toString() + 'px';
        }

        function editSessionAssignee(s) {
            $uibModal.open({
                templateUrl: 'app/partial/admin/session-assign.html',
                controller: 'SessionAssignController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    selectedSession: s,
                    availableUsers: function() {return vm.users; }
                }
            })
                .result.then(function() {
                logger.success('Sessions assigned', 'Success');
            });
        }

        function autoAssign(){
            sessionService.autoAssignSessions().then(function(response){
                getSessions();
            });
        }

        function getAvailableVolunteers() {

            roleService.getUsersForRoleName('Everyone').then(function (data) {
                vm.users = _.sortBy(data,function(user){ return user.LastName + ', ' + user.FirstName; });
            });
        }
    }
})();
/* jshint +W117 */
