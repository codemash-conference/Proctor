'use strict';
(function() {
    angular
        .module('app.filters')
        .filter('userCsvToObj', userCsvToObj);

        function userCsvToObj() {
            return function(input) {
                var rows = input.split('\n');
                var obj = [];
                angular.forEach(rows, function (val) {
                    var o = val.split(',');
                    obj.push({
                        firstName: o[0],
                        lastName: o[1],
                        email: o[2],
                        cellNumber: o[3],
                        password: '',
                        userName: o[2],
                        EmailConfirmed: true,
                        IsActive: true,
                        imported: false
                    });
                });
                return obj;
            };
        }
}());
