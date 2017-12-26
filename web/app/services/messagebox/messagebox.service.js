/* jshint ignore:start */
(function () {

    'use strict';

    angular
        .module('app.services')
        .factory('messageBox', messageBox);

    /* @ngInject */
    /* jshint -W101 */
    function messageBox($document, $rootScope, $compile, $timeout, $controller) {
        var defaults = {
            id: null,
            template: null,
            templateUrl: null,
            title: 'Default Title',
            backdrop: true,
            success: {label: 'OK', fn: null},
            fail: {label: 'Close', fn: null},
            cancel: {fn: null},
            controller: null, //just like route controller declaration
            backdropClass: "modal-backdrop",
            backdropCancel: true,
            footerTemplate: null,
            modalClass: "modal",
            css: {
                top: '100px',

                margin: '0 auto'
            },
            canHideButtons: false,
            hiddenButtonsPlaceholderImage: 'images/loading3.gif'
        };
        var body = $document.find('body');

        return {dialog: dialog,
            alertDialog:alertDialog,
            confirmDialog:confirmDialog,
            specialDialog:specialDialog
        };


        function dialog(templateUrl, options, passedInLocals) {

            // Handle arguments if optional template isn't provided.
            if(angular.isObject(templateUrl)){
                passedInLocals = options;
                options = templateUrl;
            } else {
                options.templateUrl = templateUrl;
            }

            options = angular.extend({}, defaults, options); //options defined in constructor

            var key;
            var idAttr = options.id ? ' id="' + options.id + '" ' : '';
            var defaultFooter = '';
            if(options.fail.label === ''){
                defaultFooter = '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
            }
            else{
                defaultFooter = '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>' +
                                    '<button class="btn" ng-click="$modalFail()">{{$modalFailLabel}}</button>';
            }
            var footerTemplate = '<div class="modal-footer">' +
                (options.canHideButtons ? '<div ng-hide="$hideButtons">' : '') +
                (options.footerTemplate || defaultFooter) +
                (options.canHideButtons
                    ? '</div><div ng-show="$hideButtons" style="text-align: center;"><img ng-src="{{$hiddenButtonsPlaceholderImage}}" alt="" /></div>'
                    : '') +
                '</div>';
            var modalBody = (function(){
                if(options.template){
                    if(angular.isString(options.template)){
                        // Simple string template
                        return '<div class="modal-body">' + options.template + '</div>';
                    } else {
                        // jQuery/JQlite wrapped object
                        return '<div class="modal-body">' + options.template.html() + '</div>';
                    }
                } else {
                    // Template url
                    return '<div class="modal-body" ng-include="\'' + options.templateUrl + '\'"></div>';
                }
            })();
            //We don't have the scope we're gonna use yet, so just get a compile function for modal
            var modalEl = angular.element(
                '<div uib-modal-window="modal-window">' +
                '      <div class="modal-header">' +
                '        <h3 class="modal-title">{{$title}}</h3>' +
                '      </div>' +
                modalBody +
                footerTemplate +
                '</div>');

            modalEl.attr({
                'class': 'modal',
                'role': 'dialog',
                'size': options.size,
                'animate': 'animate',
                'ng-style': '{\'z-index\': 1050 + $$topModalIndex*10, display: \'block\'}',
                'tabindex': -1,
                'uib-modal-animation-class': 'fade',
                'modal-in-class': 'in'
            });

            for(key in options.css) {
                if(key){
                    modalEl.css(key, options.css[key]);}
            }
            var divHTML = '<span></span>';
            var backdropEl = angular.element(divHTML);
            //backdropEl.addClass('overlay');
            //backdropEl.addClass(options.backdropClass);
            //backdropEl.addClass('fade in');

            var handleEscPressed = function (event) {
                if (event.keyCode === 27) {
                    scope.$modalCancel();
                }
            };

            var closeFn = function (evt) {
                //because the overlay is technically part of the modal, and clicking anywhere on the overlay can close
                //the modal, we need to check if the click came from the overlay
                //clicking on the overlay is the only way the evt parameter gets populated with click data
                if (evt) {
                    if (!$(evt.target).is(".overlay")) {
                        return;
                    }
                }
                body.unbind('keydown', handleEscPressed);
                if (options.backdrop) {
                    backdropEl.remove();
                }
                else {
                    modalEl.remove();
                }
            };

            body.bind('keydown', handleEscPressed);

            var ctrl, locals,
                scope = options.scope || $rootScope.$new();

            scope.$title = options.title;
            scope.$hideButtons = false;
            scope.$hiddenButtonsPlaceholderImage = options.hiddenButtonsPlaceholderImage;
            scope.$resetSessionExpiration = function () {
                $rootScope.$broadcast("hh:reset-session-expiration");
            };
            scope.$modalClose = closeFn;
            scope.$modalFail = function () {
                if (angular.isFunction(options.fail.fn)) {
                    options.fail.fn.call(this);
                }
                //var callFn = options.fail.fn || closeFn;
                //callFn.call(this);
                scope.$modalClose();
            };
            scope.$modalSuccess = function () {
                if (angular.isFunction(options.success.fn)) {
                    options.success.fn.call(this);
                }
                //var callFn = options.success.fn || closeFn;
                //callFn.call(this);
                scope.$modalClose();
            };
            scope.$modalCancel = function(evt) {
                if (angular.isFunction(options.cancel.fn)) {
                    options.cancel.fn(this);
                }
                //var callFn = options.cancel.fn || closeFn;
                //callFn.call(this);
                scope.$modalClose(evt);
            };
            scope.$modalSuccessLabel = options.success.label;
            scope.$modalFailLabel = options.fail.label;

            if (options.controller) {
                locals = angular.extend({$scope: scope}, passedInLocals);
                ctrl = $controller(options.controller, locals);
                // Yes, ngControllerController is not a typo
                modalEl.contents().data('$ngControllerController', ctrl);
            }

            $compile(modalEl)(scope);
            $compile(backdropEl)(scope);
            if (options.backdrop) {
                backdropEl.append(modalEl);
                body.append(backdropEl);
            }
            else {
                body.append(modalEl);
            }

            $timeout(function () {
                modalEl.addClass('in');
            }, 200);

            return scope;
        }


        function alertDialog(title, msg, onOk){
            return dialog(
                {id:'alert',
                    title: title,
                    template: "<div>" + msg + "</div>",
                    fail: {label:''},
                    success:{label:'Ok', fn:onOk},
                    cancel:{fn:onOk},
                    backdrop: true});


        }

        function specialDialog(title, msg, btnRetry, btnLogout, onRetry, onLogout){
            return dialog(
                {id:'alert',
                    title: title,
                    template: "<div>" + msg + "</div>",
                    success:{label:btnRetry, fn:onRetry},
                    fail:{label:btnLogout, fn:onLogout},
                    cancel:{fn:onRetry},
                    backdrop: true,
                    backdropCancel: false
                });


        }

        function confirmDialog(title, msg, onYes, onNo, onCancel){
            return dialog(
                {id:'confirm',
                    title: title,
                    template: "<div>" + msg + "</div>",
                    fail: {
                        label:'No',
                        fn: onNo
                    },
                    success: {
                        label:'Yes',
                        fn: onYes
                    },
                    cancel: {
                        fn: onCancel
                    },
                    backdrop: true});


        }

    }
}());
/* jshint ignore:end */
