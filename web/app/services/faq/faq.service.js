(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('faqService', faqService);

    function faqService($q, $http, moment, config) {

        var service = {
            getFaqs: getFaqs,
            getFaqById: getFaqById,
            createFaq: createFaq,
            updateFaq: updateFaq,
            deleteFaq: deleteFaq,
            newFaqObj: newFaqObj
        };

        return service;

        function newFaqObj() {
            return {
                Id: null,
                Question: '',
                Answer: '',
                Ordinal: 0
            };
        }

        function getFaqs(){
            var apiUrl = config.apiUrl + '/api/Faqs';
            var faqs = [];

            var faq = newFaqObj();
            faq.Question = 'What is the room number for the quiet room?';
            faq.Answer = '2435';

            faqs.push(faq);

            faq = newFaqObj();
            faq.Question = 'What is the room number for the speaker room?';
            faq.Answer = '1435';

            faqs.push(faq);

            return faqs;

            /*return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
            */
        }

        function getFaqById(id) {
            var apiUrl = config.apiUrl + '/api/Faqs/' + id;

            return $http.get(apiUrl)
                .then(function(response){
                    return response.data;
                });
        }

        function createFaq(FaqName) {
            var apiUrl = config.apiUrl + '/api/Faqs';

            return $http.post(apiUrl, FaqName)
                .then(function(response){
                    return response;
                });

        }

        function updateFaq(Faq) {
            var apiUrl = config.apiUrl + '/api/Faqs';

            return $http.put(apiUrl, Faq)
                .then(function(response){
                    return response;
                });
        }

        function deleteFaq(id) {
            var apiUrl = config.apiUrl + '/api/Faqs/' + id;

            return $http.delete(apiUrl)
                .then(function(response){
                    return response;
                });
        }
    }
})();
