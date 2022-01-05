'use strict';
(function () {

    angular
        .module('app.partial')
        .controller('HomeController', HomeController);

    function HomeController(userService) {
        var vm = this;
        vm.loggedIn = false;


        activate();


        function activate() {
            vm.loggedIn = userService.user().loggedIn;
        }


    }
})();
