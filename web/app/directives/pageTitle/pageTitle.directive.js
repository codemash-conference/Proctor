(function() {
    'use strict';

    angular
        .module('app.directives')
        .directive('pageTitle', pageTitle);

    function pageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title
                    var title = 'LUNA | AngularJS Responsive WebApp';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) { title = 'LUNA | ' + toState.data.pageTitle; }
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    }

})();
