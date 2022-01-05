'use strict';
(function () {

    angular
        .module('app.partial')
        .controller('VolunteerAppController', VolunteerAppController);

    function VolunteerAppController($uibModal) {
        var vm = this;

        vm.apply = apply;

        activate();

        function activate() {

        }

        function apply(){
            $uibModal.open({
                templateUrl: 'app/partial/home/apply.html',
                controller: 'ApplyController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                }
            })
                .result.then(function(data) {
            });

        }
    }
})();
