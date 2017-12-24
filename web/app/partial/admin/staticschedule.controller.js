(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('StaticScheduleController', StaticScheduleController);

    function StaticScheduleController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'User';

        activate();

        function activate() {
        }
    }
})();
