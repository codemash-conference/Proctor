(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('UsersController', UsersController);

    function UsersController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'User';

        activate();

        function activate() {
        }
    }
})();
