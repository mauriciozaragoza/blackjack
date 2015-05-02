/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .controller('StartController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        $scope.join = function () {
            $modalInstance.close('join');
        };

        $scope.host = function () {
            $modalInstance.close('host');
        };
    }]);