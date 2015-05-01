/**
 * Created by erosespinola on 4/28/2015.
 */

var _ = require('lodash');

var options = {};

//*** Hand Class ***//

function Hand() {
    this.cards = [];
}

Hand.prototype.getScore = function () {
    var s = 0;
    for (var i = 0; i < this.cards.length; i++)
        s += this.cards[i].value;

    return s;
};

Hand.prototype.isBust = function () {
    return this.getScore() > 21;
};

Hand.prototype.dealCard = function (card) {
    this.cards.push(card);
};

//*** Card Class ***//

function Card(name, suit, value) {
    this.name = name;
    this.suit = suit;
    this.value = value;
}

//*** Deck Class ***//

function Deck() {
	this.deckStack = generateDeck(options.decksNumber);
}

Deck.prototype.shuffle = function () {
    this.deckStack = shuffle(this.deckStack);
};

Deck.prototype.getCard = function() {
	var card = this.deckStack.pop();
	return card;
};

function generateDeck(decksNumber) {
    var values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    var suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    var deck = [];

    for (var currentDeck = 0; currentDeck < decksNumber; currentDeck++) {
        for (var value = 0; value < values.length; value++) {
            for (var suit = 0; suit < suits.length; suit++) {
                deck.push(new Card(values[value], suits[suit], value + 1));
            }
        }
    }

    return deck;
}

shuffle = function (deck) {
    //for (var j, x, i = deck.length; i;
    //	j = parseInt(Math.random() * i),
    //	x = deck[--i],
    //	deck[i] = deck[j],
    //	deck[j] = x);
    	
    return _.shuffle(deck);
};

exports.Game = function (opt) {
    options = opt;

    this.deck = new Deck();
    this.playersHand = [];
    for (var i = 0; i < options.playersNumber; i++)
        this.playersHand.push(new Hand());
    this.dealerHand = new Hand();
}