(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('MyScheduleController', MyScheduleController);

    function MyScheduleController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'My Schedule';

        activate();

        function activate() {
        }
    }
})();
