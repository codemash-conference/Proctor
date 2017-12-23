'use strict';
   angular
        .module('app.services')
        .factory('$global', ['$rootScope', 
            function ($rootScope) {
            	var self = {};
            	self.settings = {
            		fullscreen:false
            	};

            	self.get = function (key) { return self.settings[key]; };
		        self.set = function (key, value) {
		            this.settings[key] = value;
		            $rootScope.$broadcast('globalStyles:changed', {key: key, value: self.settings[key]});
		            $rootScope.$broadcast('globalStyles:changed:'+key, self.settings[key]);
		        };
		        self.values = function () { return self.settings; };
		        return self;        
            }]);