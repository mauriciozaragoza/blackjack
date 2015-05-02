/**
 * Created by Mauricio on 4/21/2015.
 */
'use strict';

var blackjack = require('./blackjack');
var _ = require('lodash');

var rooms = {};

module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('connected');

        // A player chooses 'host game', a room id must be returned
        socket.on('host', function (){
            console.log('host');

            var id = _.random(0, 99999);

            // TODO check if room does not exist previously

            rooms[id] = {
                clients: [socket],
                started: false,
                players: 0
            };

            socket.emit('host', {
                id: id
            });
        });

        // A player chooses 'join game' and enters a game ID
        // Returns join success or failure
        socket.on('join', function (message){
            console.log('join', message);

            if (_.has(rooms, message.id)) {
                if (rooms[message.id].started && rooms[message.id].players < 6) {
                    socket.emit('join', {
                        success: false,
                        error: 'The game is full or already started.'
                    });
                    return;  
                }

                rooms[message.id].clients.push(socket);
                rooms[message.id].players++;
                socket.emit('join', {
                    success: true
                });

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
            console.log('start', message);

            if (_.has(rooms, message.id)) {
                rooms[message.id].started = true;

                // TODO broadcast that the game started

                var n = 2;
                var m = 3;

                var game = new blackjack.Game({ decksNumber: n, playersNumber: m });
                game.deck.shuffle();

                game.playersHand[0].dealCard(game.deck.getCard());
                game.playersHand[1].dealCard(game.deck.getCard());
                game.playersHand[2].dealCard(game.deck.getCard());

                game.dealerHand.dealCard(game.deck.getCard());

                console.log("Player 1 score is: " + game.playersHand[0].getScore());
                console.log("Player 2 score is: " + game.playersHand[1].getScore());
                console.log("Player 3 score is: " + game.playersHand[2].getScore());

                console.log("Dealer score is: " + game.dealerHand.getScore());

                console.log("Cards remaining: " + game.deck.deckStack.length);
            }
            else {
                socket.emit('start', {
                    success: false,
                    error: 'The game room does not exist.'
                });
            }
        });
    });
};