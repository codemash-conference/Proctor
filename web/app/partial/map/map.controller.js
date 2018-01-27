(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('MapController', MapController);

    function MapController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'Map';
        vm.getStatus = getStatus;

        activate();

        function activate() {
        }

        function getStatus(room){
            if(room === 'Guava')
            {
                return "has_session_notcheckedin";
            }
            return "has_session_checkedin";
        }
    }
})();
