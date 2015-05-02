/**
 * Created by Mauricio on 4/20/2015.
 */

'use strict';

angular.module('BlackjackApp', [
    'ngAnimate',
    'btford.socket-io'
])
    .factory('BlackjackSocket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }])
    .factory('Blackjack', ['BlackjackSocket', '$animate', function (BlackjackSocket, $animate) {
        var players = [{
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
        }, {
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
        }, {
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
        }, {
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

        var currentPlayerIndex = 1;
        var currentPlayer = players[currentPlayerIndex];
        var turn = 0;

        BlackjackSocket.emit('chat message', {
            message: 'something'
        });

        function computeValue() {
            currentPlayer.value = _.reduce(currentPlayer.cards, function(total, card) {
                return total + card.value;
            }, 0);
        }

        function changeTurn(index) {
            turn = index;
        }

        function addCardTo(card, index) {
            players[index].cards.push(card);

            if (index == currentPlayerIndex) {
                computeValue();
            }
        }

        computeValue();

        return {
            players: players,
            currentPlayer: currentPlayer,
            currentPlayerIndex: currentPlayerIndex,
            turn: turn,

            hit: function () {
                console.log('hit');

                addCardTo({
                    name: 'queen',
                    color: 'clubs',
                    value: 10
                }, currentPlayerIndex);
            },

            stand: function () {
                console.log('stand');
            }
        };
    }])
    .controller('MainController', ['$scope', 'Blackjack', function ($scope, Blackjack) {
        $scope.Blackjack = Blackjack;

        $scope.columnRatio = Math.floor(12 / Blackjack.players.length);
    }]);
