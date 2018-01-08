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
        vm.imported = false;
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
            if(vm.imported){
                $uibModalInstance.close(vm.imported);
            }
            else {
                $uibModalInstance.dismiss('cancel');
            }
        }

        function loadStaticSessions() {
            $timeout(function(){vm.sessions = $filter('staticSessionCsvToObj')(vm.fileContent);}, 100);
        }

        function importStaticSessions(){
            vm.imported = true;
            _.forEach(vm.sessions, function(session){
                session.sessionTime = null;
                sessionService.createSession(session).then(function (response) {
                    session.imported = true;
                });
            });
            logger.success('Sessions Imported', 'Success');
        }
    }
})();
/* jshint +W117 */
