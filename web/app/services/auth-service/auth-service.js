(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('authService', authService);

    function authService($http, $q, $log, localStorageService, config, jwtHelper, $rootScope) {

        var authentication = {
            isAuth: false,
            userName : ''
        };

        return {
            saveRegistration : saveRegistration,
            login : login,
            logOut : logOut,
            fillAuthData : fillAuthData,
            authentication : authentication
        };

        function saveRegistration(registration) {

            logOut();

            return $http.post(config.apiUrl + '/api/account/register', registration)
                .then(function (response) {
                    return response;
                });
        }

        function login(loginData) {

            var data = 'grant_type=password&username=' + loginData.userName +
            '&password=' + loginData.password;

            var deferred = $q.defer();

            $http.post(config.apiUrl + '/api/token', data, {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function (response) {
                var user = angular.fromJson(response.user);
                localStorageService.set('authorizationData',
                    {token: response.access_token, userName: loginData.userName});
                authentication.isAuth = true;
                authentication.userName = loginData.userName;
                var tokenPayload = jwtHelper.decodeToken(response.access_token);
                localStorageService.set('userName', tokenPayload['unique_name']);
                if(Array.isArray(tokenPayload.role)) {
                    localStorageService.set('roles', tokenPayload.role);
                }
                else{
                    localStorageService.set('roles', Array(tokenPayload.role));
                }
                localStorageService.set('loggedIn', true);
                localStorageService.set('email', user.Email);
                localStorageService.set('firstName', user.FirstName);
                localStorageService.set('lastName', user.LastName);
                localStorageService.set('gravatar', user.Gravatar);
                localStorageService.set('cell', user.CellNumber);
                localStorageService.set('userId', user.Id);
                localStorageService.set('userObj', user);


                $log.debug(tokenPayload);
                $rootScope.$broadcast("user:LoggedIn");
                $rootScope.$broadcast("nav:Refresh");
                return deferred.resolve(response);

            }).error(function (err, status) {
                logOut();
                return deferred.reject(err);
            });

            return deferred.promise;
        }

        function logOut() {

            localStorageService.clearAll();
            authentication.isAuth = false;
            authentication.userName = '';
            $rootScope.$broadcast("user:LoggedOut");
            $rootScope.$broadcast("nav:Refresh");
        }

        function fillAuthData() {

            var authData = localStorageService.get('authorizationData');
            if (authData)
            {
                authentication.isAuth = true;
                authentication.userName = authData.userName;
            }

        }
    }
})();
