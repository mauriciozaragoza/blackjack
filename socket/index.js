/**
 * Created by Mauricio on 4/21/2015.
 */
'use strict';

var blackjack = require('./blackjack');
var _ = require('lodash');

var rooms = {};
var MAX_PLAYERS = 6;

module.exports = function(io) {
    io.on('connection', function (socket) {
        // A player chooses 'host game', a room id must be returned
        socket.on('host', function (){
            var id = _.random(0, 99999);

            while(_.has(rooms, id)) {
                id = _.random(0, 99999);
            }

            rooms[id] = {
                clients: [socket],
                started: false,
                players: 1,
                game: null,
                turn: 0
            };

            socket.emit('host', {
                id: id
            });
        });

        // A player chooses 'join game' and enters a game ID
        // Returns join success or failure
        socket.on('join', function (message){
            if (_.has(rooms, message.id)) {
                // Send notification if the room is full or the game is already started
                if (rooms[message.id].started && rooms[message.id].players < MAX_PLAYERS) {
                    socket.emit('join', {
                        success: false,
                        error: 'The game is full or already started.'
                    });
                    return;
                }

                // Add the player to clients
                rooms[message.id].clients.push(socket);
                rooms[message.id].players++;
                socket.emit('join', {
                    success: true,
                    id: message.id,
                    playerIndex: rooms[message.id].players - 1
                });

                // Broadcast number of players
                _.forEach(rooms[message.id].clients, function(n) {
                    n.emit('playercount', {
                        playercount: rooms[message.id].players
                    });
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
                rooms[message.id].started = true;

                // Broadcast that game started and next turn
                _.forEach(rooms[message.id].clients, function(n) {
                    n.emit('start', {
                        start: true
                    });
                    n.emit('turn', {
                        turn: rooms[message.id].turn
                    });
                });

                var n = 3;
                var m = rooms[message.id].players;

                // Create game with 3 decks and m players
                rooms[message.id].game  = new blackjack.Game({ decksNumber: n, playersNumber: m });
                rooms[message.id].game.deck.shuffle();

                // Deal 2 cards to everyplayer
                for (var i = 0; i < rooms[message.id].game.playersHand.length; i++) {
                    var firstCard = rooms[message.id].game.deck.getCard();
                    var secondCard = rooms[message.id].game.deck.getCard();

                    rooms[message.id].game.playersHand[i].dealCard(firstCard);
                    rooms[message.id].game.playersHand[i].dealCard(secondCard);

                    // Broadcast player's hand
                    _.forEach(rooms[message.id].clients, function(n) {
                        n.emit('playerHand', {
                            hand: rooms[message.id].game.playersHand[i].getHand(),
                            userId: i
                        });
                    });
                }

                // Deal 2 card for dealer
                var firstDealerCard = rooms[message.id].game.deck.getCard();
                var secondDealerCard = rooms[message.id].game.deck.getCard();
                rooms[message.id].game.dealerHand.dealCard(firstDealerCard);
                rooms[message.id].game.dealerHand.dealCard(secondDealerCard);

                // Broadcast dealer's hand
                _.forEach(rooms[message.id].clients, function(n) {
                    n.emit('dealerHand', {
                        hand: [firstDealerCard, secondDealerCard]
                    });
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
                // If not your turn return
                if (message.userId != rooms[message.id].turn) {
                    socket.emit('turnError');
                    return;
                }

                // Deal a card for the player
                var newCard = rooms[message.id].game.deck.getCard();
                rooms[message.id].game.playersHand[message.userId].dealCard(newCard);
                
                // Broadcast the given card
                _.forEach(rooms[message.id].clients, function(n) {
                    n.emit('playerHand', {
                        hand: rooms[message.id].game.playersHand[message.userId].getHand(),
                        userId: message.userId
                    });
                });

                // Check if the player is busted and broadcast it if so
                if (rooms[message.id].game.playersHand[message.userId].isBust()) {
                    rooms[message.id].game.playersHand[message.userId].changeAses();

                    if (rooms[message.id].game.playersHand[message.userId].isBust()) {
                        _.forEach(rooms[message.id].clients, function(n) {
                            n.emit('bust', {
                                userId: message.userId
                            });
                        });
                    }
                }

                // Check if the player has a blackjack and broadcast it if so
                if (rooms[message.id].game.playersHand[message.userId].isBlackJack()) {
                    _.forEach(rooms[message.id].clients, function(n) {
                        n.emit('blackjack', {
                            userId: message.userId
                        });
                    });
                }

                // Broadcast next turn
                var c = 1;
                rooms[message.id].turn = (rooms[message.id].turn + c) % rooms[message.id].players;
                while (rooms[message.id].game.playersHand[rooms[message.id].turn].isBust()) {
                    rooms[message.id].turn = (rooms[message.id].turn + c) % rooms[message.id].players;
                    c++;
                }
                _.forEach(rooms[message.id].clients, function(n) {
                    n.emit('turn', {
                        turn: rooms[message.id].turn
                    });
                });
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
                if (message.userId != rooms[message.id].turn) {
                    socket.emit('turnError');
                    return;
                }

                // Broadcast next turn
                rooms[message.id].turn = (rooms[message.id].turn + 1) % rooms[message.id].players;
                _.forEach(rooms[message.id].clients, function(n) {
                    n.emit('turn', {
                        turn: rooms[message.id].turn
                    });
                });
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