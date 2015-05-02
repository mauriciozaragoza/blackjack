/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .controller('JoinController', ['$scope', '$modalInstance', 'Blackjack', function ($scope, $modalInstance, Blackjack) {
        $scope.join = function () {
            Blackjack.join($scope.roomId, function (data) {
               if (data.success) {
                   $modalInstance.close(data.id);
               }
               else {
                   $scope.message = data.error;
               }
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);