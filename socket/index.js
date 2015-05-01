/**
 * Created by Mauricio on 4/21/2015.
 */
'use strict';

var blackjack = require('./blackjack');

var n = 1;
var m = 3;

module.exports = function(io) {
    io.on('connection', function (socket) {
        //players++;
        console.log('connected');

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

        socket.on('chat message', function(msg){
            console.log(msg);
        });
    });
};