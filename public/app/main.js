/**
 * Created by Mauricio on 4/20/2015.
 */

'use strict';

angular.module('BlackjackApp', [
    'btford.socket-io'
])
    .factory('BlackjackSocket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }])
    .controller('MainController', ['$scope', 'BlackjackSocket', function ($scope, BlackjackSocket) {
        BlackjackSocket.emit('chat message', {
            message: 'something'
        });

        function computeValue() {
            $scope.currentPlayerValue = _.reduce($scope.currentPlayer.cards, function(total, card) {
                console.log(card, total);
                return total + card.value;
            }, 0);
        }

        $scope.players = [{
            cards: [{
                name: 'flip'
            }, {
                name: 'flip'
            }, {
                name: 'queen',
                color: 'clubs',
                value: 10
            }, {
                name: '5',
                color: 'spades',
                value: 5
            }, {
                name: '2',
                color: 'diamonds',
                value: 2
            }]
        },
            {
                cards: [{
                    name: 'ace',
                    color: 'spades',
                    value: 11
                }, {
                    name: '3',
                    color: 'clubs',
                    value: 3
                }, {
                    name: '2',
                    color: 'hearts',
                    value: 2
                }]
            },{
                cards: [{
                    name: 'flip'
                }, {
                    name: 'flip'
                }, {
                    name: 'queen',
                    color: 'clubs',
                    value: 10
                }, {
                    name: '5',
                    color: 'spades',
                    value: 5
                }, {
                    name: '2',
                    color: 'diamonds',
                    value: 2
                }]
            },{
                cards: [{
                    name: 'flip'
                }, {
                    name: 'flip'
                }, {
                    name: 'queen',
                    color: 'clubs',
                    value: 10
                }, {
                    name: '5',
                    color: 'spades',
                    value: 5
                }, {
                    name: '2',
                    color: 'diamonds',
                    value: 2
                }]
            }];

        $scope.currentPlayerIndex = 1;
        $scope.currentPlayer = $scope.players[$scope.currentPlayerIndex];
        $scope.currentPlayerValue = 0;

        computeValue();

        $scope.getCard = function () {
            $scope.currentPlayer.cards.push({
                name: 'ace',
                color: 'diamonds',
                value: 1
            });

            computeValue();
        };

        $scope.stand = function () {
            console.log('stand');
        };
    }]);
