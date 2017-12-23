(function () {
    'use strict';

    angular
        .module('app.services')
        .config(function($locationProvider){
            $locationProvider.html5Mode(false);
        });

    var core = angular.module('app.services');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[Error] ',
        appTitle: 'Proctor',
        apiUrl: 'http://localhost:53982'
    };


    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'exceptionHandlerProvider', 'localStorageServiceProvider'];
    /* @ngInject */
    function configure($logProvider, exceptionHandlerProvider, localStorageServiceProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);

         localStorageServiceProvider
                 .setPrefix('proctor')
                 .setStorageType('localStorage');
    }

    core.factory('headerInjector', [function() {
        var headerInjector = {
            request: function(config) {
                config.headers['Accept'] = 'application/json, text/javascript, */*; q=0.01';

                return config;
            }
        };
        return headerInjector;
    }]);
    core.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('headerInjector');
    }]);
})();
