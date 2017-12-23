/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.services')
        .constant('toastr', toastr)
        .constant('moment', moment);
})();
