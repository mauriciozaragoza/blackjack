/**
 * Created by Mauricio on 4/21/2015.
 */
'use strict';

var blackjack = require('./blackjack');
var _ = require('lodash');

var rooms = {};
var MAX_PLAYERS = 6;

module.exports = function (io) {
    io.on('connection', function (socket) {
        // A player chooses 'host game', a room id must be returned
        socket.on('host', function () {
            var id = _.random(0, 99999);

            while (_.has(rooms, id)) {
                id = _.random(0, 99999);
            }

            rooms[id] = {
                clients: [socket],
                started: false,
                players: 1,
                game: null,
                turn: 0,
                lastHit: 0
            };

            socket.emit('host', {
                id: id
            });
        });

        // A player chooses 'join game' and enters a game ID
        // Returns join success or failure
        socket.on('join', function (message) {
            if (_.has(rooms, message.id)) {
                var room = rooms[message.id];

                // Send notification if the room is full or the game is already started
                if (rooms[message.id].started && room.players < MAX_PLAYERS) {
                    socket.emit('join', {
                        success: false,
                        error: 'The game is full or already started.'
                    });
                    return;
                }

                // Add the player to clients
                room.clients.push(socket);
                room.players++;
                socket.emit('join', {
                    success: true,
                    id: message.id,
                    playerIndex: room.players - 1
                });

                // Broadcast number of players
                broadcast(room, 'playercount', {
                    playercount: room.players
                });
            }
            else {
                socket.emit('join', {
                    success: false,
                    error: 'The game room does not exist.'
                });
            }
        });

        // Starts a game given a room
        // Should broadcast a start signal to clients in room
        socket.on('start', function (message) {
            if (_.has(rooms, message.id)) {
                var room = rooms[message.id];

                room.started = true;

                // Broadcast that game started and next turn
                broadcast(room, 'start');
                broadcast(room, 'turn', {
                    turn: room.turn
                });

                var n = 3;
                var m = room.players;

                // Create game with 3 decks and m players
                room.game = new blackjack.Game({decksNumber: n, playersNumber: m});
                room.game.deck.shuffle();

                // Deal 2 cards to every player
                for (var i = 0; i < room.game.playersHand.length; i++) {
                    var firstCard = room.game.deck.getCard();
                    var secondCard = room.game.deck.getCard();

                    room.game.playersHand[i].dealCard(firstCard);
                    room.game.playersHand[i].dealCard(secondCard);

                    // Broadcast player's hand
                    broadcast(room, 'playerHand', {
                        hand: room.game.playersHand[i].getHand(),
                        userId: i
                    });
                }

                // Deal 2 card for dealer
                var firstDealerCard = room.game.deck.getCard();
                var secondDealerCard = room.game.deck.getCard();
                room.game.dealerHand.dealCard(firstDealerCard);
                room.game.dealerHand.dealCard(secondDealerCard);

                // Broadcast dealer's hand
                broadcast(room, 'dealerHand', {
                    hand: [firstDealerCard, secondDealerCard]
                });
            }
            else {
                socket.emit('start', {
                    success: false,
                    error: 'The game room does not exist.'
                });
            }
        });

        // A player chooses 'hit' for a new card
        // Broadcast the given card to the room and the next turn
        socket.on('hit', function (message) {
            if (_.has(rooms, message.id)) {
                var room = rooms[message.id];

                // If not your turn return
                if (message.userId != room.turn) {
                    socket.emit('turnError');
                    return;
                }

                // Deal a card for the player
                var newCard = room.game.deck.getCard();
                room.game.playersHand[message.userId].dealCard(newCard);

                // Broadcast the given card
                broadcast(room, 'playerHand', {
                    hand: room.game.playersHand[message.userId].getHand(),
                    userId: message.userId
                });

                // Check if the player is busted and broadcast it if so
                if (room.game.playersHand[message.userId].isBust()) {
                    room.game.playersHand[message.userId].changeAses();

                    if (room.game.playersHand[message.userId].isBust()) {
                        broadcast(room, 'bust', {
                            userId: message.userId
                        });
                    }
                }

                // Check if the player has a blackjack and broadcast it if so
                if (room.game.playersHand[message.userId].isBlackJack()) {
                    broadcast(room, 'blackjack', {
                        userId: message.userId
                    });
                }

                nextTurn(room);

                room.lastHit = message.userId;
            }
            else {
                socket.emit('hit', {
                    success: false,
                    error: 'Hit failed.'
                });
            }
        });

        // A player chooses 'stand' skip his turn
        // Broadcast the next turn
        socket.on('stand', function (message) {
            if (_.has(rooms, message.id)) {
                var room = rooms[message.id];

                if (message.userId != room.turn) {
                    socket.emit('turnError');
                    return;
                }

                nextTurn(room);

                // If all stood check winner
                if (room.lastHit == room.turn) {
                    var results = [];

                    for (var i = 0; i < room.game.playersHand.length; i++) {
                        results.push(21 - room.game.playersHand[i].getScore());
                    }

                    var index = 0;
                    var value = results[0];
                    for (var i = 1; i < results.length; i++) {
                        if (results[i] < value) {
                            value = results[i];
                            index = i;
                        }
                    }

                    if (results[index] < (21 - room.game.dealerHand.getScore())) {
                        // Broadcast winner
                        broadcast(room, 'winner', {
                            userId: index
                        });
                    } else {
                        // Broadcast winner
                        broadcast(room, 'winnerDealer');
                    }
                }
            }
            else {
                socket.emit('stand', {
                    success: false,
                    error: 'Stand failed.'
                });
            }
        });
    });
};

function nextTurn(room) {
    var startingTurn = room.turn;

    do {
        room.turn = (room.turn + 1) % room.players;

        if (startingTurn == room.turn) {            // All players went bust
            broadcast(room, 'winnerDealer');
            return false;
        }
    } while (room.game.playersHand[room.turn].isBust());

    broadcast(room, 'turn', {
        turn: room.turn
    });

    return true;
}

function broadcast(room, tag, payload) {
    _.forEach(room.clients, function (client) {
        client.emit(tag, payload);
    });
}