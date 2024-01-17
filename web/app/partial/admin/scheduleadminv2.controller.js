'use strict';
(function () {

    angular
        .module('app.partial')
        .controller('ScheduleAdminV2Controller', ScheduleAdminV2Controller);
    /* jshint -W071 */
    /* jshint -W117 */
    function ScheduleAdminV2Controller($q, sessionService, logger, moment,
                                       $uibModal, roleService, $timeout, $scope) {
        var vm = this;
        vm.title = 'User';
        vm.sessions = [];
        vm.currentDate = '';
        vm.dates = [];
        vm.rooms = [];
        vm.users = [];
        vm.times = [];
        vm.dateRoomSessions = [];
        vm.scrollPosition = 0;


        vm.importFeed = importFeed;
        vm.autoAssign = autoAssign;

        vm.getCardState = getCardState;
        vm.getTop = getTop;
        vm.getHeight = getHeight;
        vm.editSessionAssignee = editSessionAssignee;
        vm.selectDate = selectDate;
        vm.getTextPosition = getTextPosition;
        vm.getSessionPosition = getSessionPosition;
        vm.getRoomRowHeight = getRoomRowHeight;

        activate();

        function activate() {
            getSessions();
            getAvailableVolunteers();
            $timeout(registerScrollEvent, 1000);
        }

        function registerScrollEvent(){
            var test = $('.guide-times-container').scroll(function (){
                $scope.$digest();
            });
        }

        function getTimes() {
            vm.times = [];
            var cDate = moment(vm.currentDate.formattedDate);
            while (cDate < moment(vm.currentDate.formattedDate).add(1,'days')){
                vm.times.push(cDate.format('h:mm A'));
                cDate = cDate.add(30, 'minutes');
            }
        }

        function selectDate(date) {
            vm.currentDate = date;
            getTimes();
            //updateGuide();
            $timeout(resetScrollBar,1);
        }

        function importFeed() {
            sessionService.importSessionData().then(function(response){
                getSessions();
            });
        }

        function getSessions() {
            sessionService.getSessions().then(function (data) {
                var dateRoomSessions = [];
                vm.sessions = data;
                _.forEach(data, function(session) {
                    var sessionDay = _.find(dateRoomSessions, function(dateRoomSession) {
                        return moment(session.SessionStartTime).format("M/D/YY") === dateRoomSession.formattedDate;
                    });

                    //Check to see if the session day exists in the array
                    if(!sessionDay){
                        //Session day does not exist, so add it
                        sessionDay = {
                            formattedDate: moment(session.SessionStartTime).format("M/D/YY"),
                            rawStartDate: moment(session.SessionStartTime).toDate(),
                            rooms: [],

                            minSessionStartTime: function (){
                                return _.min(this.rooms, function (r){
                                    return moment(r.minSessionStartTime()).toDate();
                                });
                            }
                        };
                        dateRoomSessions.push(sessionDay);
                    }

                    var sessionRoomString = session.roomString =  _.map(
                        _.sortBy(session.Rooms,function(room) { return room.Name;}),
                        'Name')
                        .join(',');

                    var sessionRoom = _.find(sessionDay.rooms, function (room){ return sessionRoomString === room.roomString; });
                    //Check to see if the session room exists in the array
                    if(!sessionRoom){
                        //Session room does not exist, so add it
                        sessionRoom = {
                            roomString : sessionRoomString,
                            sessions: [],
                            minSessionStartTime: function (){
                                return _.min(this.sessions, function (s){ return moment(s.SessionStartTime).toDate();});
                            }
                        };
                        sessionDay.rooms.push(sessionRoom);
                    }

                    //Make changes to the session position
                    var row = 0;
                    session.left = moment(session.SessionStartTime).diff(moment(sessionDay.formattedDate), 'seconds') / 10 * 1.11111111;
                    session.right = moment(session.SessionEndTime).diff(moment(sessionDay.formattedDate), 'seconds') / 10 * 1.11111111;
                    session.width = session.right - session.left;

                    if(session.Id === 276 || session.Id === 277 || session.Id === 278){
                        var x = 1;
                    }

                    _.forEach(sessionRoom.sessions, function (s) {
                        if(session.Id !== s.Id && s.placed){
                            var r1 = moment.range(moment(session.SessionStartTime), moment(session.SessionEndTime));
                            var r2 = moment.range(moment(s.SessionStartTime), moment(s.SessionEndTime));
                            if(r1.overlaps(r2)){
                                if(row <= s.rowNumber) {
                                    row = s.rowNumber;
                                }
                            }
                        }
                    });
                    session.rowNumber = row + 1;
                    session.top = row * 30;
                    session.placed = true;
                    session.updateCount = 0;

                    session.rawStartDate = moment(session.SessionStartTime).toDate();
                    session.rawEndDate = moment(session.SessionEndTime).toDate();


                        //Session collisions
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

                    //Add the session to the room
                    sessionRoom.sessions.push(session);

                });
                vm.dateRoomSessions = dateRoomSessions;

                vm.currentDate = vm.dateRoomSessions[0];
                getTimes();
                $timeout(resetScrollBar,1);
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

        function getTextPosition(session) {
            var scrollPosition = $('.guide-times-container').scrollLeft();
            vm.scrollPosition = scrollPosition;
            if(session.left < scrollPosition)
            {
                return {
                    left: scrollPosition - session.left + 'px',
                    width: (session.width - (scrollPosition - session.left)) - 13 + 'px'
                };
            }
            return { left: 0, width: session.width + 'px' };
        }

        function resetScrollBar() {
            var minSessionStartTime = vm.currentDate.minSessionStartTime().minSessionStartTime().SessionStartTime;
            var left = moment(minSessionStartTime).diff(moment(vm.currentDate.formattedDate), 'seconds') / 10 * 1.11111111;
            //var left = moment(moment()).diff(moment(vm.selectedDate), 'seconds') / 10 * 1.11111111;
            $('.guide-times-container').scrollLeft(left);
            registerScrollEvent();
        }

        function getSessionPosition(session) {
            return {
                top:session.top + 'px',
                left:session.left + 'px',
                right:session.right + 'px',
                width:session.width + 'px'
            };
        }

        function getRoomRowHeight(room){
            var rows = _.maxBy(room.sessions, function (r) {
                return r.rowNumber;
            }).rowNumber;

            if(rows <= 1){
                return { height: '30px'};
            }

            return {height: (rows * 30).toString() + 'px'};
        }
    }
})();
