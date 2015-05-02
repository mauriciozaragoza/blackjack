/**
 * Created by Mauricio on 5/2/2015.
 */

angular.module('BlackjackApp')
    .factory('BlackjackSocket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }])
    .factory('Blackjack', ['BlackjackSocket', function (BlackjackSocket) {
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

            // TODO use $q.defer instead?
            roomId: null,

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
            },

            host: function (callback) {
                var me = this;

                BlackjackSocket.on('host', function (message) {
                    console.log('Hosting on room: ', message.id);
                    me.roomId = message.id;

                    if (_.isFunction(callback)) {
                        callback(message.id);
                    }
                });

                BlackjackSocket.emit('host');
            },

            join: function (roomId, callback) {
                var me = this;

                BlackjackSocket.on('join', function (message) {
                    if (message.success) {
                        console.log('Joined room: ', message.id);

                        me.roomId = roomId;

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
    }])