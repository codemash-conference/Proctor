(function() {
    'use strict';

    angular
        .module('app.directives')
        .directive('minimalizaMenu', minimalizaMenu);

    function minimalizaMenu($rootScope) {
        return {
            restrict: 'EA',
            template: '<div class="left-nav-toggle"><a href ng-click="minimalize()"><i class="stroke-hamburgermenu"></i> </a>',
            controller: function ($scope, $element, $window) {
                var $ = $ || $window.$;
                $scope.minimalize = function () {
                    $("body").toggleClass("nav-toggle");
                };
            }
        };
    }

})();
