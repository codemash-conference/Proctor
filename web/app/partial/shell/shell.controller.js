(function() {
    'use strict';

    angular
        .module('app.partial')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$timeout', 'config', 'logger'];
    /* @ngInject */
    function ShellController($timeout, config, logger) {
        var vm = this;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.navline = {
            title: config.appTitle,
            text: 'Created by John Papa',
            link: 'http://twitter.com/john_papa'
        };

        logger.success(config.appTitle + ' loaded!', null);
    }
})();
