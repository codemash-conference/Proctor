(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('AllSchedulesController', AllSchedulesController);

    function AllSchedulesController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'User';

        activate();

        function activate() {
        }
    }
})();
