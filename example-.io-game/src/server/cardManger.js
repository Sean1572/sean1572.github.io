const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');
//const Player = require('./player');
//const cards= require('./cards')
//const cardsSignals = require('./cardsSignals');
var cardText = ["Walked in the desert for 40 years","_________ (Write What you Want!)","_________ (Write What you Want!)","_________ (Write What you Want!)","_________ (Write What you Want!)","Is __________  (Write What you Want!)","Is __________  (Write What you Want!)","Is __________  (Write What you Want!)","Is __________  (Write What you Want!)","Is a supermodel","Will listen to all and any of your rants","Does not involve you in any drama","Loves anime","Is a rocket scientist","Smells nice","Super attractive","Smart","Has strong passions","Loyal","Loves dogs","Loves cats","Is Jesus Christ","Can take you to a fantasy world for dates","Your parents love them" ,"Lives in a castle","Loves Video Games","Rich","Is royalty" ,"Has been in a James Bond Movie","Is a professional voice actor","Owns a magic carpet","Is interested in the same things you are","Has soft ass hair","You will never have to work while you date them","You have guaranteed success at work/school while you date them","Never gonna give you up, let you down, run around and desert you","Never gonna make you cry", "Never gonna say goodbye","Never gonna tell lie or hurt you","Has the hottest bod","Will always support you","Will take the relationship the speed you want","Has nice eyes","Knows how to help you unwind","Owns your favorite restaurant","Smoking hot","Is Hatsune Miku","Has an 8 pack","Has your favorite facial hair","Always sincere","Is willing to make a computer game so you can have fun during the pandemic","Willing to talk it out","Is actually Prince Ali","Great programmer","Understands your needs","Agrees with your political views","Always gives your perfect gifts","Can get you into any event without cost","Will become president of the united states"];
var cardSignalText = ["Constantly Trying to kill you","Underage","Is __________  (Write What you Want!)","Is __________  (Write What you Want!)","Is __________  (Write What you Want!)","Is on death row","Calls you by ex’s name","Always ask to borrow your credit card/money","Quotes Shakespeare when you are feeling down","Does not find you attractive","Is Henry Peter","Slept with one of your parents.... Recently","Has tentacles","Punched your family…. On several different occasions","Brags about the previous ex","Always asks if your sibling wants to hang out","Wants to wait till marriage","Is a literal dog","Death row inmate","Is openly racist","Alcoholic" ,"Has slept with siblings","Takes you to a dog fight on your first date","Is Hatsune Miku","Has facial hair","Amateur cannibal" ,"Was involved in college admission scandal","Does not believe COVID-19 exisits" ,"Never washes his hands","Gets forzen woe… everytime","Still in 4th grade","Puts ‘air quotes’ around every ‘word’","Does nothing for the relationship","Wants you to convert to thier blood-god cult","Live streams your date","Is the president of the united states"];
//var cardSignalText = ["Hello World"];
class CardManger {
  constructor() {
    //super(shortid(), x, y, dir, 0);
  }

  DrawCard(player, cards, numOfCards, flag) {
    var pos = player.pos;
    console.log("Pos: " +player.pos);
    try {
        for (var i = 0; i < numOfCards; i++) {
            var drawPile = cards.filter(b => b.parentID == -1,);
            var randomCardID = Math.floor(Math.random() * drawPile.length);
            console.log("Card Selected" + randomCardID);
            drawPile[randomCardID].parentID = pos;
            if(!flag) {
                player.numOfCardsInHand++;
                drawPile[randomCardID].posInHand = player.numOfCardsInHand;
            } else {
                player.numOfFlagsInHand++;
                drawPile[randomCardID].posInHand = player.numOfFlagsInHand;
            }
           
        }
    } catch{
        console.log("Ran out of cards?")
        i = numOfCards;
    }
    
  }

  init(cards, cardsSignals) {
    var redFlags = "Red Flags";
    const card = require('./cards')
    const cardSignals = require('./cardsSignals');
    var x = -100;
    var y = -150;
    var i;
    for (i = 0; i < cardText.length; i++) {
      cards[i] = new card(-1, x, y, 0, cardText[i]);
    }
    for (i = 0; i < cardSignalText.length; i++) {
      cardsSignals[i] = new card(-1, x, y, 0, cardSignalText[i]);
    }
    
    /*cards[1] = new card(-1, x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[2] = new card(-1, x, y, 0, "EHH ETHAN IS PRETTY WACK");
    cards[3] = new card(-1, x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    
    cards[4] = new card(-1, x, y, 0, "EHH ETHAN IS PRETTY WACK");
    cards[5] = new card(-1, x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[6] = new card(-1, x, y, 0, "EHH ETHAN IS PRETTY WACK");
    cards[7] = new card(-1, x, y, 0, "BRYAN IS A PRETTY COOL DUDE");

    cards[8] = new card(-1, x, y, 0, "EHH ETHAN IS PRETTY WACK");
    cards[9] = new card(-1, x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[10] = new card(-1,x, y, 0, "EHH ETHAN IS PRETTY WACK");
    cards[11] = new card(-1,x, y, 0, "BRYAN IS A PRETTY COOL DUDE");

    cards[12] = new card(-1,x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[13] = new card(-1,x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[14] = new card(-1,x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[15] = new card(-1,x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[16] = new card(-1,x, y, 0, "BRYAN IS A PRETTY COOL DUDE");
    cards[17] = new card(-1,x, y, 0, "BRYAN IS A PRETTY COOL DUDE");






    cardsSignals[0] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[1] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[2] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[3] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[4] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[5] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[3] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[4] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");
    cardsSignals[5] = new cardSignals(-1, x, y, 0, "JESSICA IS A COOL PERSON");*/
  }
}



module.exports = CardManger;
