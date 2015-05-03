/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .factory('BlackjackSocket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }])
    .factory('Blackjack', ['BlackjackSocket', '$rootScope', 'toaster', function (BlackjackSocket, $rootScope, toaster) {
        var out = {
            dealer: {
                cards: []
            },
            players: [],
            currentPlayer: null,
            currentPlayerIndex: 0,
            playerCount: 1,
            turn: -1,

            // TODO use $q.defer instead?
            roomId: null,

            hit: function () {
                BlackjackSocket.emit('hit', {
                    id: out.roomId,
                    userId: out.currentPlayerIndex
                });
            },

            stand: function () {
                BlackjackSocket.emit('stand', {
                    id: out.roomId,
                    userId: out.currentPlayerIndex
                });
            },

            start: function () {
                BlackjackSocket.emit('start', {
                    id: this.roomId
                });
            },

            host: function (callback) {
                var me = this;

                BlackjackSocket.on('host', function (message) {
                    console.log('Hosting on room: ', message.id);

                    me.roomId = message.id;
                    me.currentPlayerIndex = 0;

                    if (_.isFunction(callback)) {
                        callback(message.id);
                    }
                });

                BlackjackSocket.emit('host');
            },

            join: function (roomId, callback) {
                var me = this;

                BlackjackSocket.on('join', function (message) {
                    console.log('Join: ', message);
                    if (message.success) {

                        me.roomId = message.id;
                        me.currentPlayerIndex = message.playerIndex;

                        if (_.isFunction(callback)) {
                            callback({
                                success: true,
                                id: roomId
                            });
                        }
                    }
                    else {
                        if (_.isFunction(callback)) {
                            callback({
                                success: false,
                                error: message.error
                            });
                        }
                    }
                });

                BlackjackSocket.emit('join', {
                    id: roomId
                });
            }
        };

        // LISTENERS
        BlackjackSocket.on('bust', function (message) {
            toaster.pop('error', 'Busted', 'Player ' + (message.userId + 1) + ' has been busted!');
        });

        BlackjackSocket.on('turn', function (message) {
            console.log('turn', message);
            out.turn = message.turn;
        });

        BlackjackSocket.on('turnError', function () {
            toaster.pop('error', 'It\'s not your turn');
        });

        BlackjackSocket.on('dealerHand', function (message) {
            out.dealer.cards = message.hand;
        });

        BlackjackSocket.on('playerHand', function (message) {
            console.log('playerHand', message);
            out.players[message.userId].cards = message.hand;
        });

        BlackjackSocket.on('playercount', function (message) {
            console.log('playercount', message);
            toaster.pop('note', 'Join', 'A player has joined');
            out.playerCount = message.playercount;
        });

        BlackjackSocket.on('start', function (message) {
            console.log('start', message);

            for (var i = 0; i < out.playerCount; i++) {
                out.players.push({
                    cards: []
                });
            }

            out.currentPlayer = out.players[out.currentPlayerIndex];

            $rootScope.$broadcast('start');
        });

        return out;
    }]);