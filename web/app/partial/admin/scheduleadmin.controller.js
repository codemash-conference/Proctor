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
               return cDate === moment(session.sessionStartTime).format("M/D/YY") &&
                   room === session.roomString;
            });
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var parsed = _.chain(data)
                    .filter(function(session) {
                        var room = session.rooms[0] ? session.rooms[0].name : '';
                        return session.sessionType === 'General Session' ||
                            session.sessionType === 'Pre-Compiler' ||
                            session.sessionType === 'Static Session' ||
                            session.sessionType === 'Sponsor Session' ||
                            room === 'Guava' || room === 'Tamarind';
                    })
                    .sortBy(function(session) { return session.sessionStartTime; })
                    .forEach(function(session) {
                        session.roomString =  _.map(
                                                _.sortBy(session.rooms,function(room) { return room.name;}),
                                                'name')
                                                .join(',');
                        session.hasCollisions = function(){
                            var hasCollision = false;
                            var session = this;
                            _.forEach(this.assignees, function(assignee){
                                var assigneeSchedule = _.filter(vm.sessions, function(session){
                                    return _.find(session.assignees, function(a){
                                        return a.id === assignee.id;
                                    });
                                });

                                var collision = _.find(assigneeSchedule, function(session2){
                                    if(session.id === session2.id){ return false; }
                                    var sessionRange1 = moment.range(session.sessionStartTime, session.sessionEndTime);
                                    var sessionRange2 = moment.range(session2.sessionStartTime, session2.sessionEndTime);
                                    return sessionRange1.overlaps(sessionRange2);
                                });
                                if(collision) {
                                    hasCollision = true;
                                }


                            });
                            return hasCollision;
                        };
                    })
                    .value();

                vm.dates = _.chain(parsed).uniqBy(function(session) {
                    return moment(session.sessionStartTime).format("M/D/YY");
                })
                    .map(function(session){ return moment(session.sessionStartTime).format("M/D/YY");})
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
            if(session.hasCollisions()){
                return 'error';
            }

            if(session.volunteersRequired === 0 && session.assignees.length > 0)
            {
                return 'ok';
            }

            if(session.volunteersRequired >0 && session.assignees.length >= session.volunteersRequired)
            {
                return 'ok';
            }

            return '';
        }

        function getTop(session) {
            var x = moment.duration(moment(session.sessionStartTime).format('HH:mm')) / 60000;
            x = x - 375;
            return x.toString() + 'px';
        }

        function getHeight(session) {
            var x = moment.duration(moment(session.sessionStartTime).format('HH:mm')) / 60000;
            var y = moment.duration(moment(session.sessionEndTime).format('HH:mm')) / 60000;
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
                vm.users = _.sortBy(data,function(user){ return user.lastName + ', ' + user.firstName; });
            });
        }
    }
})();
/* jshint +W117 */
