(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ResponsibilitiesController', ResponsibilitiesController);

    function ResponsibilitiesController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'Responsibilities';

        activate();

        function activate() {
        }
    }
})();
