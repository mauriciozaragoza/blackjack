/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .controller('HostController', ['$scope', '$modalInstance', 'Blackjack', function ($scope, $modalInstance, Blackjack) {
        $scope.Blackjack = Blackjack;

        Blackjack.host(function (roomId) {
            $scope.roomId = roomId;
        });

        $scope.start = function () {
            Blackjack.start();
        };

        $scope.$on('start', function () {
            $modalInstance.close();
        });
    }]);