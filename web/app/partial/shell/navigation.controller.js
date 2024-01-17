/* jshint -W117 */
(function() {
    'use strict';

    angular
        .module('app.partial')
        .controller('NavigationController', NavigationController);

    function NavigationController($scope, $state, userService, $rootScope, authService) {
        var vm = this;
        var states = $state.get();
        vm.isCurrent = isCurrent;
        vm.menuSelect = menuSelect;
        vm.isSelected = isSelected;
        vm.logout = logout;
        vm.evnt = {};
        vm.navSelected = '';
        vm.userName = '';
        vm.loggedIn = false;

        activate();

        function activate() {
            vm.userName = userService.user().username;
            vm.loggedIn = userService.user().loggedIn;
            getNavRoutes();
            bindEvents();
        }

        function bindEvents(){
            vm.evnt.navRefresh = $rootScope.$on('nav:Refresh', getNavRoutes);
            $scope.$on("$destroy", function () { cleanUp(); });
        }

        function getNavRoutes() {
            vm.navRoutes = _.chain(states)
                .filter(function(r){return r.settings && r.settings.mainNavigation && r.settings.level === 0; })
                .filter(function(r) {return hasAccess(r);})
                .map(function(state) { state.categories = state.name.split('.') || []; return state;})
                .sortBy(function(r) { return r.settings.ordinal || 0; } )
                .map(function(nav){
                    nav.subnav = _.chain($state.get())
                        .filter(function(r){return r.settings && r.settings.mainNavigation && r.settings.level === 1;})
                        .filter(function(r) {return hasAccess(r);})
                        .map(function(state) { state.categories = state.name.split('.') || []; return state;})
                        .filter(function(r){ return r.categories[0] === nav.categories[0];})
                        .sortBy(function(r) { return r.settings.ordinal || 0; } )
                        .value();
                    return nav;
                })
                .value();
        }

        function hasAccess(r){
            if(r.settings && r.settings.rolesAllowed && _.intersection(userService.user().roles,
                    r.settings.rolesAllowed).length > 0)
            {
                return true;
            }
            return false;
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }
            var menuName = route.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        function isSelected(navId, navSelected) {
            var activeRoute = $state.current.name;
            var separateRoutes = activeRoute.split('.');

            if (!navSelected) {navSelected = separateRoutes[1];}

            if(navId === navSelected) {
                return false;
            } else if ($state.current.name.indexOf(navId) === -1 && navId === navSelected ) {
                return false;
            } else {
                return true;
            }

        }

        function menuSelect(selection, navSelected) {
            var separateRoutes = selection.name.split('.');

            if(selection.name === navSelected || separateRoutes[0] === navSelected) {
                vm.navSelected = '';
            } else {
                vm.navSelected = selection.name;
            }
            if($("body").width() < 768 && !selection.abstract){
                $("body").toggleClass("nav-toggle");
            }
        }

        function cleanUp(){
            if (vm.evnt.navRefresh) {
                vm.evnt.navRefresh();
            }
        }

        function logout() {
            authService.logOut();
            $state.go("login");
        }

        $scope.$on('globalStyles:changed', function (event, newVal) {
            vm[newVal.key] = newVal.value;
        });
    }
})();
/* jshint +W117 */
