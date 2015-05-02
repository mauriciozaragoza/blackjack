/**
 * Created by erosespinola on 4/28/2015.
 */

var _ = require('lodash');

var options = {};

// Hand Class

// Constructor with an empty hand
function Hand() {
    this.cards = [];
}

// Get the user's hand score
Hand.prototype.getScore = function () {
    var s = 0;
    for (var i = 0; i < this.cards.length; i++)
        s += this.cards[i].value;

    return s;
};

// T
Hand.prototype.isBust = function () {
    return this.getScore() > 21;
};

Hand.prototype.dealCard = function (card) {
    this.cards.push(card);
};

Hand.prototype.getHand = function () {
    return this.cards;
}

//*** Card Class ***//

function Card(name, color, value) {
    this.name = name;
    this.color = color;
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
    var colors = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    var deck = [];

    for (var currentDeck = 0; currentDeck < decksNumber; currentDeck++) {
        for (var value = 0; value < values.length; value++) {
            for (var color = 0; color < colors.length; color++) {
                deck.push(new Card(values[value], colors[color], value + 1));
            }
        }
    }

    return deck;
}

shuffle = function (deck) {    	
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