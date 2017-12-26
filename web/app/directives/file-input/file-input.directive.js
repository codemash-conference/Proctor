/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('fileInput', fileInput);

    /* @ngInject */
    function fileInput() {
        return {
            scope: {
                fileInput:"=",
                fileInputCallback:"&"
            },
            link: function(scope, element, $windows) {
                var $ = jQuery || $windows.jQuery;
                $(element).on('change', function(changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;
                            scope.$apply(function () {
                                scope.fileInput = contents;
                                scope.fileInputCallback();
                            });

                        };

                        r.readAsText(files[0]);
                    }
                });
            }
        };    }
})();
