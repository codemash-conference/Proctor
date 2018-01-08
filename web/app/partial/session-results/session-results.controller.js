/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('SessionResultsController', SessionResultsController);

    function SessionResultsController($q, sessionService, logger, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.title = 'Session Results';
        vm.sessions = [];

        vm.dtOptions3 = DTOptionsBuilder.newOptions()
            .withDOM("<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp")
            .withButtons([
                {extend: 'csv',title: 'SessionResults', className: 'btn-sm'},
                {extend: 'pdf', title: 'SessionResults', className: 'btn-sm'},
                {extend: 'print',className: 'btn-sm'}
            ]);

        vm.columns = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
            DTColumnDefBuilder.newColumnDef(9),
            DTColumnDefBuilder.newColumnDef(10),
            DTColumnDefBuilder.newColumnDef(11),
            DTColumnDefBuilder.newColumnDef(12)
        ];

        activate();

        function activate() {
            getSessionResults();
        }

        function getSessionResults() {
            sessionService.getSessionResults().then(function (data) {
                vm.sessions = _.chain(data)
                    .sortBy(function (session) { return session.sessionStartTime;})
                    .value();


            });
        }



    }
})();
/* jshint +W117 */
