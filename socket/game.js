/**
 * Created by erosespinola on 4/28/2015.
 */

var blackjack = require('./blackjack');
var game;

var n = 1;
var m = 3;

game = new blackjack.Game({ decksNumber: n, playersNumber: m });
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
