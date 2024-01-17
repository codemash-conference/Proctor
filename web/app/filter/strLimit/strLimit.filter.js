'use strict';
(function() {
    angular
        .module('app.filters')
        .filter('strLimit', strLimit);

    function strLimit($filter) {
        return function(input, limit, more) {
            if (input.length <= limit) {
                return input;
            }
            return $filter('limitTo')(input, limit) + (more || '...');
        };
    }
}());
