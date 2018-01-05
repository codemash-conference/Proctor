/* jshint -W040 */
(function() {
    'use strict';

    angular
        .module('app.directives')
        .directive('htWidgetHeader', htWidgetHeader);

    /* @ngInject */
    function htWidgetHeader() {
        //Usage:
        //<div ht-widget-header title="vm.map.title"></div>
        // Creates:
        // <div ht-widget-header=""
        //      title="Movie"
        //      allow-collapse="true" </div>
        var directive = {
            bindToController: true,
            controller: htWidgetHeaderController,
            controllerAs: 'vm',
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: 'app/directives/widget-header/widget-header.html',
            restrict: 'EA'
        };

        /* @ngInject */
        function htWidgetHeaderController($scope, $location, userService, $rootScope, $state, authService) {

            var vm = this;
            vm.evnt = {};
            vm.userName = '';
            vm.loggedIn = false;
            vm.user = userService.user();
            vm.logout = logout;

            activate();

            function activate(){
                vm.userName = userService.user().username;
                vm.loggedIn = userService.user().loggedIn;
                bindEvents();
            }
            function bindEvents(){
                vm.evnt.loggedIn = $rootScope.$on('user:LoggedIn', UserLoggedIn);
                vm.evnt.loggedOut = $rootScope.$on('user:LoggedOut', UserLoggedOut);
                $scope.$on("$destroy", function () { cleanUp(); });
            }

            function UserLoggedIn() {
                vm.userName = userService.user().username;
                vm.loggedIn = userService.user().username;
            }

            function UserLoggedOut() {
                vm.userName = userService.user().username;
                vm.loggedIn = userService.user().username;
            }

            function cleanUp(){
                if (vm.evnt.loggedIn) {
                    vm.evnt.loggedIn();
                }
                if (vm.evnt.loggedOut) {
                    vm.evnt.loggedOut();
                }
            }

            function logout() {
                authService.logOut();
                $state.go("login");
            }

        }



        return directive;
    }
})();
/* jshint +W040 */
