(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('GroupsController', GroupsController);

    function GroupsController(logger) {
        var vm = this;
        vm.title = 'Groups';

        activate();

        function activate() {
            logger.info('Activated Group View');
        }
    }
})();
