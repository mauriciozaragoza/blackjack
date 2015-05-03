/**
 * Created by erosespinola on 4/28/2015.
 */

var _ = require('lodash');

var options = {};

// Hand Class

// Constructor of an empty hand
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

// Change the user's hand ases from value 11 to 1
Hand.prototype.changeAses = function () {
    for (var i = 0; i < this.cards.length; i++) {
        if(this.cards[i].value == 11) {
            this.cards[i].value == 1;
            return;
        }
    }
}

// Check if the player is bust or not
Hand.prototype.isBust = function () {
    return this.getScore() > 21;
};

// Check if the player has a blackjack
Hand.prototype.isBlackJack = function () {
    return this.getScore() == 21;
};

// Deal a card for the player
Hand.prototype.dealCard = function (card) {
    this.cards.push(card);
};

// Get the player hand of cards
Hand.prototype.getHand = function () {
    return this.cards;
}

// Card Class

// Constructor of a card with the given name, color and value
function Card(name, color, value) {
    this.name = name;
    this.color = color;
    this.value = value;
}

// Deck Class

// Constructor of a deck with options.deckNumber number of decks
function Deck() {
	this.deckStack = generateDeck(options.decksNumber);
}

// Shuffle decks
Deck.prototype.shuffle = function () {
    this.deckStack = shuffle(this.deckStack);
};

// Get a card from the deck and pop it
Deck.prototype.getCard = function() {
	var card = this.deckStack.pop();
	return card;
};

// Generate decksNumber decks for the game
function generateDeck(decksNumber) {
    var values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    var score = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    var colors = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    var deck = [];

    for (var currentDeck = 0; currentDeck < decksNumber; currentDeck++) {
        for (var value = 0; value < values.length; value++) {
            for (var color = 0; color < colors.length; color++) {
                deck.push(new Card(values[value], colors[color], score[value]));
            }
        }
    }

    return deck;
}

// Shuffe the deck
shuffle = function (deck) {    	
    return _.shuffle(deck);
};

// Exports the game with options.playersNumber
// number of players and a dealer
exports.Game = function (opt) {
    options = opt;

    this.deck = new Deck();
    this.playersHand = [];
    for (var i = 0; i < options.playersNumber; i++)
        this.playersHand.push(new Hand());
    this.dealerHand = new Hand();
}