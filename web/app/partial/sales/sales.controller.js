(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('SalesController', SalesController);

    //SalesController.$inject = ['$q', 'salesService', 'logger'];
    /* @ngInject */
    function SalesController($q, salesService, logger, moment) {
        var vm = this;
        vm.title = 'Sales';
        vm.time = moment();
        vm.salesData = null;

        activate();

        function activate() {
            salesService.getSummary(moment().format('MM-DD-YYYY')).then(function(data){
                vm.salesData = data;
            });
        }
    }
})();
