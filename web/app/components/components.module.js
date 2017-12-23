/* global toastr:false, moment:false, _:false */
(function() {
    'use strict';

    var app = angular
        .module('app.components', [])
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('lodash', _);

})();
