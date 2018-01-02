/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ImportStaticSessionsController', ImportStaticSessionsController);

    function ImportStaticSessionsController($q, salesService, logger, moment, sessionService,
                                   $uibModalInstance, $filter, $timeout) {
        var vm = this;
        vm.title = 'Import Static Sessions';
        vm.fileContent = null;
        vm.sessions = null;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.importStaticSessions = importStaticSessions;
        vm.loadStaticSessions = loadStaticSessions;

        activate();

        function activate() {
        }

        function ok() {
            $uibModalInstance.close();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function loadStaticSessions() {
            $timeout(function(){vm.sessions = $filter('staticSessionCsvToObj')(vm.fileContent);}, 100);
        }

        function importStaticSessions(){
            _.forEach(vm.sessions, function(session){
                session.sessionTime = null;
                sessionService.createSession(session).then(function (response) {
                    session.imported = true;
                });
            });
        }
    }
})();
/* jshint +W117 */
