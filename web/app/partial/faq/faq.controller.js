(function () {
    'use strict';
    angular
        .module('app.partial')
        .controller('FaqController', FaqController);

    function FaqController(faqService) {
        var vm = this;
        vm.title = 'FAQ';
        vm.filter = '';
        vm.faqs = [];

        activate();

        function activate() {
            getFaqs();
        }

        function getFaqs() {
            vm.faqs = faqService.getFaqs();
        }
    }
})();
