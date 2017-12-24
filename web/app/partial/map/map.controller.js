(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('MapController', MapController);

    function MapController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'Map';

        activate();

        function activate() {
        }
    }
})();
