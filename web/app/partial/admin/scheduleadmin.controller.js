(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ScheduleAdminController', ScheduleAdminController);

    function ScheduleAdminController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'User';

        activate();

        function activate() {
        }
    }
})();
