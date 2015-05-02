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
        console.log('connected');

        // A player chooses 'host game', a room id must be returned
        socket.on('host', function (){
            console.log('host');

            var id = _.random(0, 99999);

            while(_.has(rooms, id)) {
                id = _.random(0, 99999);
            }

            rooms[id] = {
                clients: [socket],
                started: false,
                players: 1,
                game: null
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
                if (rooms[message.id].started && rooms[message.id].players < MAX_PLAYERS) {
                    socket.emit('join', {
                        success: false,
                        error: 'The game is full or already started.'
                    });
                    return;
                }

                rooms[message.id].clients.push(socket);
                rooms[message.id].players++;
                socket.emit('join', {
                    success: true,
                    id: message.id,
                    playerIndex: rooms[message.id].players - 1
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

                _.forEach(rooms[message.id].clients, function(n) {
                    n.emit('started', {
                        started: true
                    });
                });

                var n = 3;
                var m = rooms[message.id].players;

                rooms[message.id].game  = new blackjack.Game({ decksNumber: n, playersNumber: m });
                rooms[message.id].game.deck.shuffle();

                for (var i = 0; i < rooms[message.id].game.playersHand.length; i++) {
                    var firstCard = rooms[message.id].game.deck.getCard();
                    var secondCard = rooms[message.id].game.deck.getCard();

                    socket.emit('card', {
                        success: firstCard
                    });

                    socket.emit('card', {
                        success: secondCard
                    });

                    rooms[message.id].game.playersHand[i].dealCard(firstCard);
                    rooms[message.id].game.playersHand[i].dealCard(secondCard);
                }

                rooms[message.id].game.dealerHand.dealCard(rooms[message.id].game.deck.getCard());
                rooms[message.id].game.dealerHand.dealCard(rooms[message.id].game.deck.getCard());
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