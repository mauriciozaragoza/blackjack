/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .controller('JoinController', ['$scope', '$modalInstance', 'Blackjack', function ($scope, $modalInstance, Blackjack) {
        $scope.joined = false;
        $scope.Blackjack = Blackjack;

        $scope.join = function () {
            console.log($scope.roomId);
            Blackjack.join($scope.roomId, function (data) {
               if (data.success) {
                   $scope.joined = true;
               }
               else {
                   $scope.message = data.error;
               }
            });
        };

        $scope.$on('start', function () {
            $modalInstance.close('started');
        })
    }]);