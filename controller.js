angular.module('webchat', []).
    controller('ChatController', function ($scope, $http) {
        console.log("load angular");
        $scope.User = "";
        _msgHistory = [];
        $scope.sendMsg = function () {
            
        }

        var loadStartup = function () {
            _msgHistory = [];
        }
    });  


