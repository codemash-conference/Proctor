(function() {
    'use strict';

    angular
        .module('app.partial')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($scope, $location, $global, authService) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'LoginController';
        vm.authData = {};
        vm.login = login;        

        $global.set('fullscreen', true);

        function login() {
            if($scope.loginForm.$invalid){
                $scope.loginForm.username.$pristine = false;
                $scope.loginForm.password.$pristine = false;
                return;
            }
           authService.login(vm.authData)
                .then(function() {
                    $global.set('fullscreen', false);
                    $location.path('/');
                }, function(err){
                    vm.errorMessage = err.error_description;
                });
        }        
    } 
})();
