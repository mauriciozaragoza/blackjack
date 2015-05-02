/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .factory('BlackjackSocket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }])
    .factory('Blackjack', ['BlackjackSocket', '$rootScope', function (BlackjackSocket, $rootScope) {
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
                    userId: out.currentPlayerIndex
                });
            },

            stand: function () {
                console.log('stand');
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
        BlackjackSocket.on('turn', function (message) {
            out.turn = message.turn;
        });

        BlackjackSocket.on('dealerHand', function (message) {
            out.dealer.cards = message.hand;
        });

        BlackjackSocket.on('playerHand', function (message) {
            out.players[message.userId].cards = message.hand;
        });

        BlackjackSocket.on('playercount', function (message) {
            console.log('playercount', message);
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