(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('HelpersController', HelpersController);

    function HelpersController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'User';

        activate();

        function activate() {
        }
    }
})();
