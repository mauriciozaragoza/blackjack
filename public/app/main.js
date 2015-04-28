/**
 * Created by Mauricio on 4/20/2015.
 */

var blackjack = require('./blackjack');
var game;
var decks = 1;
var players = 0;
game = new blackjack.Game({ decksNumber: decks }); 

'use strict';

angular.module('BlackjackApp', [
        'btford.socket-io'
    ])
    .factory('BlackjackSocket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }])
    .controller('MainController', ['$scope', 'BlackjackSocket', function ($scope, BlackjackSocket) {
        BlackjackSocket.on('connection', function(socket){
            players ++;
        });

        $scope.otherPlayers = [, {
            cards: [{
                name: 'flip'
            },{
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
        $scope.currentPlayer = {
            cards: [{
                name: 'flip'
            }, {
                name: 'flip'
            }, {
                name: 'ace',
                color: 'spades',
                value: 11
            }, {
                name: 'king',
                color: 'diamonds',
                value: 10
            }, {
                name: '3',
                color: 'clubs',
                value: 3
            }, {
                name: '2',
                color: 'hearts',
                value: 2
            }]
        };

        $scope.getCard = function() {
            $scope.currentPlayer.cards.push({
               name: 'flip'
            });
        };
    }]);