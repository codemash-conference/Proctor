(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('salesService', salesService);

    //salesService.$inject = ['$q', '$http', 'moment'];
    /* @ngInject */
    function salesService($q, $http, moment) {

        var service = {
            getSalesForFranchisee: getSalesForFranchisee,
            getSummary: getSummary
        };

        return service;

        function getSalesForFranchisee(franchiseeId){
           var apiUrl = 'https://home.hungryhowies.com/_layouts/api2/' + 'sql/ordersforday/'+
                moment().format('MM-DD-YYYY') + '/ALL' + franchiseeId;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data == null ? {} : response.data.orderforday;
                });
        }

        function getSummary(businessDate){
            return $http.get('https://home.hungryhowies.com/_layouts/api2/' + '/sql/franchisees/' +
                '00001' + '/sales/' + businessDate)
                .then(getDataComplete);
        }

        function getDataComplete(response) {
            return response.data == null ? {} : response.data.orders;
        }

    }
})();
