/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .controller('MainController', ['$scope', '$modal', 'Blackjack', function ($scope, $modal, Blackjack) {
        $scope.Blackjack = Blackjack;
        $scope.columnRatio = Math.floor(12 / Blackjack.players.length);

        $modal.open({
            templateUrl: 'app/modals/start.html',
            controller: 'StartController',
            backdrop: 'static'
        })
            .result.then(function (mode) {
                switch (mode) {
                    case 'join':
                        $modal.open({
                            templateUrl: 'app/modals/join.html',
                            controller: 'JoinController',
                            backdrop: 'static'
                        });
                        break;
                    case 'host':
                        $modal.open({
                            templateUrl: 'app/modals/host.html',
                            controller: 'HostController',
                            backdrop: 'static'
                        });
                        break;
                }
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
    }]);