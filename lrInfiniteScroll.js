(function (ng) {
    'use strict';
    var module = ng.module('lrInfiniteScroll', []);

    module.directive('lrInfiniteScroll', ['$timeout', '$window', function ($timeout, $window) {
        return{
            scope: {
                handler: "&lrInfiniteScroll",
                scrollThreshold: "@scrollThreshold",
                timeThreshold: "@timeThreshold",
            },
            link: function (scope, element, attr) {
                scope.scrollThreshold = parseInt(scope.scrollThreshold || 50);
                scope.timeThreshold = parseInt(scope.timeThreshold || 400);
                var windowScroll = attr.windowScroll !== undefined ? true : false;

                var promise = null;
                var lastRemaining = 9999;

                function onScroll(element) {
                    var remaining = element.scrollHeight - (element.clientHeight + element.scrollTop);

                    //if we have reached the threshold and we scroll down
                    if (remaining < scope.scrollThreshold && (remaining - lastRemaining) < 0) {

                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }

                        promise = $timeout(function () {
                            scope.handler();
                            promise = null;
                        }, scope.timeThreshold);
                    }

                    lastRemaining = remaining;
                }

                element.bind('scroll', function () {
                    onScroll(element[0]);
                });

                if (windowScroll) {
                    $window.addEventListener('scroll', function () {
                        onScroll(document.body);
                    });
                }
            }

        };
    }]);
})(angular);

