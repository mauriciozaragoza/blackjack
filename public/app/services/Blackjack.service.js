/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .factory('BlackjackSocket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }])
    .factory('Blackjack', ['BlackjackSocket', '$rootScope', function (BlackjackSocket, $rootScope) {
        var out = {
            players: players,
            currentPlayer: null,
            currentPlayerIndex: 0,
            playerCount: 0,
            turn: 0,

            // TODO use $q.defer instead?
            roomId: null,

            hit: function () {
                console.log('hit');

                addCardTo({
                    name: 'queen',
                    color: 'clubs',
                    value: 10
                }, this.currentPlayerIndex);
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

        var players = [];

        function computeValue() {
            out.currentPlayer.value = _.reduce(out.currentPlayer.cards, function(total, card) {
                return total + card.value;
            }, 0);
        }

        function addCardTo(card, index) {
            players[index].cards.push(card);

            if (index == out.currentPlayerIndex) {
                computeValue();
            }
        }

        BlackjackSocket.on('playercount', function (message) {
            console.log('playercount', message);
            out.playerCount = message.playercount;
        });

        BlackjackSocket.on('gamestart', function (message) {
            console.log('gamestart', message);

            $rootScope.$broadcast('start');

            players = [{
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

            computeValue();
        });

        return out;
    }]);