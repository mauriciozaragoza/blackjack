/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .controller('HostController', ['$scope', '$modalInstance', 'Blackjack', function ($scope, $modalInstance, Blackjack) {
        Blackjack.host(function (roomId) {
           $scope.roomId = roomId;
        });

        $scope.start = function () {
            $modalInstance.close('a');
        };
    }]);