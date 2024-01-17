/* jshint -W040 */
(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('searchBox', searchBox);

    function searchBox() {
        var directive = {
            bindToController: true,
            controller: searchBoxController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                watermarkText: '=',
                filter: '='
            },
            templateUrl: 'app/directives/search-box/search-box.html'
        };

        function searchBoxController($scope) {
            var vm = this;

            activate();

            function activate() {
            }
        }
        return directive;
    }
})();
