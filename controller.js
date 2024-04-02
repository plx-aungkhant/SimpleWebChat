angular.module('webchat', [])
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        }
    })
    .controller('ChatController', function ($scope, $http) {
        $scope.User = "";
        var isInitial = true;
        var page = 1;
        var pageSize = 25;
        var skipscroll = false;
        loadStartup();
        $scope.sendMsg = function (_msg) {
            if (isInitial) {
                $scope.User = _msg;
                isInitial = false;
            }
            else {
                setDatabyUser(_msg);
            }

            fetchData();
            $scope.SendText = "";
            //scrollDown();
        }
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            scrollDown();
        });

       
        //refresh message between tabs
        window.addEventListener('storage', function (event) {
            if (event.key === 'CHAT_DATA') {
                fetchData();
                $scope.$apply();
                //scrollDown();
            }
        });

        $(".chat-thread").bind("scroll", function () {
            if ($(this).scrollTop() == 0) {
                page++;
                skipscroll = true;
                fetchData();
            }
        });

        function scrollDown() {
            if (!skipscroll) {
                var scroll = $('.chat-thread');
                scroll.animate({ scrollTop: scroll[0].scrollHeight }, 500);
            }
            skipscroll = false;
        }

        function loadStartup() {
            $scope._msgHistory = [{ USER_NAME: "Welcome!", MSG: "Please enter your User Name." }];
        }

        function fetchData() {
            var storageData;
            if (!localStorage.CHAT_DATA) {
                storageData = [];
            }
            else {
                var tmpData = JSON.parse(localStorage.CHAT_DATA);
                var arrLength = tmpData.length;
                var lastItem = arrLength - 1;
                var fetchItems = page * pageSize;
                var itemFrom = lastItem - fetchItems > 0 ? lastItem - fetchItems : 0;
                var itemTo = arrLength;
                storageData = tmpData.slice(itemFrom, itemTo);
            }

            storageData.forEach(function (e) {
                e.IS_ME = e.USER_NAME == $scope.User ? true : false;
            });
            $scope._msgHistory = storageData;            
        }

        function setDatabyUser(Msg) {
            if (localStorage.CHAT_DATA) {
                var storageData = JSON.parse(localStorage.CHAT_DATA);
            }
            else {
                storageData = [];
            }

            storageData.push({ USER_NAME: $scope.User, MSG: Msg, DATE_TIME: new Date() });
            localStorage.CHAT_DATA = JSON.stringify(storageData);
        }
    });