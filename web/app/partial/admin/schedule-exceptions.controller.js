(function () {
    'use strict';

    angular
        .module('app.partial')
        .controller('ScheduleExceptionController', ScheduleExceptionController);

    function ScheduleExceptionController($q, messageBox, logger, userService, $uibModal,
                                         DTOptionsBuilder, DTColumnDefBuilder, scheduleExceptionService) {
        var vm = this;
        vm.title = 'Schedule Exceptions';
        vm.exceptions = [];


        vm.deleteException = deleteException;
        vm.updateException = updateException;
        vm.addException = addException;

        activate();

        vm.dtOptions3 = DTOptionsBuilder.newOptions()
            .withDOM("<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>tp")
            .withButtons([
                {extend: 'csv',title: 'Users', className: 'btn-sm'},
                {extend: 'pdf', title: 'Users', className: 'btn-sm'},
                {extend: 'print',className: 'btn-sm'}
            ]);
        vm.columns = [
            DTColumnDefBuilder.newColumnDef(0).notSortable(),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4)
        ];

        function activate() {
            getExceptions();
        }

        function getExceptions() {
            scheduleExceptionService.getAllExceptions().then(function (data) {
                vm.exceptions = data;
            });
        }

        function deleteException(exception) {
            messageBox.confirmDialog('Delete User', 'Are you sure you want to delete this exception?', function () {
                scheduleExceptionService.deleteException(exception.id).then(function(){
                    getExceptions();
                });
            });
        }

        function addException() {
            var exception = scheduleExceptionService.getNewScheduleExceptionObj();
            $uibModal.open({
                templateUrl: 'app/partial/admin/edit-schedule-exception.html',
                controller: 'EditScheduleExceptionController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    'exception' : exception,
                    'isAdd' : true
                }
            })
                .result.then(function(newException) {
                vm.exceptions.push(newException);
                getExceptions();
                logger.success('Exception Added', 'Success');
            });

        }

        function updateException(exception) {
            $uibModal.open({
                templateUrl: 'app/partial/admin/edit-schedule-exception.html',
                controller: 'EditScheduleExceptionController',
                controllerAs: 'vm',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    'exception' : exception,
                    'isAdd' : false
                }
            })
                .result.then(function() {
                getExceptions();
                logger.success('Exception Updated', 'Success');
            });
        }
    }
})();
