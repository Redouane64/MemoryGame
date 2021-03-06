/*
 * Needed variables initialization.
 */
let cards,
    classNames  = [
      "fa fa-diamond",
      "fa fa-paper-plane-o",
      "fa fa-anchor",
      "fa fa-bolt",
      "fa fa-cube",
      "fa fa-anchor",
      "fa fa-leaf",
      "fa fa-bicycle",
      "fa fa-diamond",
      "fa fa-bomb",
      "fa fa-leaf",
      "fa fa-bomb",
      "fa fa-bolt",
      "fa fa-bicycle",
      "fa fa-paper-plane-o",
      "fa fa-cube"
      ],
    openCards = [],
    openCardsIndex = [],
    totalMatches = 0,
    totalSeconds = -1,
    totalMoves = 0,
    deck = document.getElementById("deck"),
    restart = document.getElementById("restart"),
    stars = document.getElementsByClassName("stars")[0]
    moves = document.getElementsByClassName("moves")[0];

/*
 * Needed functions.
 */

const cardHtml = (card) => 
  `<li class="card">
      <i class="${card}"></i>
  </li>`;
const starsHtml = () => 
  `<li><i class="fa fa-star"></i></li>
   <li><i class="fa fa-star"></i></li>
   <li><i class="fa fa-star"></i></li>`
const addCard = (El,index) => {
  openCards.push(El.children[0].className.split(" ")[1].substring(3));
  openCardsIndex.push(index);
}
const isMatch = openCards => openCards[0] === openCards[1] && openCardsIndex[0] !== openCardsIndex[1]
const openMatchedCards = openCardsIndex => {
  if (openCardsIndex[0] === openCardsIndex[1]) return console.log("Can't match the same card.");
  cards = Array.from(cards);
  cards[openCardsIndex[0]].classList.remove("open");
  cards[openCardsIndex[0]].classList.remove("show");
  cards[openCardsIndex[0]].classList.add("match");
  cards[openCardsIndex[1]].classList.remove("open");
  cards[openCardsIndex[1]].classList.remove("show");
  cards[openCardsIndex[1]].classList.add("match");
  removeOpenCards()
};
const removeOpenCards = () => {
  for (const card of cards) {
    card.classList.remove("open");
    card.classList.remove("show");
    card.classList.remove("error");
  }
  openCards = [];
  openCardsIndex = [];
  return console.log("Removed open cards.")
}
const makeRed = () => {
  cards[openCardsIndex[0]].classList.add("error");
  cards[openCardsIndex[1]].classList.add("error");
}
const won = () =>  {
  swal({
  title: "YOU WON!",
  text: `You got ${stars.children.length} star(s) in ${totalSeconds} seconds with ${totalMoves} moves!`,
  icon: "success",
    })
  .then((value) => {
    if (value) {
      startGame();
    }
  });
}
const setScore = count  => {
  if (count === 20 || count === 30) {
    stars.removeChild(stars.children[0]);
    return  0;
  } 
}

const moveCounter = () => {
  totalMoves++;
  moves.innerHTML = totalMoves === 1 ? `${totalMoves} move` : `${totalMoves} moves`;
}
/* 
 * timer function from : https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
 */

let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
}}

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* 
 * This functions starts the game and sets the needed variables back to default value.
 */

function startGame (argument) {
  openCards = [];
  openCardsIndex = [];
  totalSeconds = -1;
  totalMoves = 0;
  totalMatches = 0;
  deck.innerHTML = "";
  moves.innerHTML ="0 moves";
  stars.innerHTML = starsHtml();
  shuffle(classNames)
  for (const className of classNames) {
    deck.insertAdjacentHTML('beforeend', cardHtml(className));
  }

  cards = document.getElementsByClassName("card")


  for (let [i,card] of Array.from(cards).entries() ) {
    card.addEventListener("click", event => {
      if (openCards.length > 2) return console.log("More than 2 elementss Already")
      card.classList.add("open");
      card.classList.add("show");
      addCard(card,i);
      if (openCards.length === 2 && (openCardsIndex[0] === openCardsIndex[1] )) return removeOpenCards();
      if (openCards.length === 2 && !isMatch(openCards)) {
        moveCounter()
        makeRed();
        setTimeout(() => removeOpenCards(),200);  
      } else if (openCards.length === 1 ) {
        return "One element is showing."
      } else {     
        moveCounter()
        openMatchedCards(openCardsIndex)
        totalMatches++;
        if (totalMatches > 7) {
          won();
        }
      }
      
      setScore(totalMoves)
    })
  }
}

restart.addEventListener("click", event => {
  swal({
  title: "Are you sure?",
  text: "Once you restart you can't recover your current game!",
  icon: "warning",
  buttons: true,
  dangerMode: true,
})
  .then((value) => {
    if (value) {
      startGame();
    }
  });
});

// We start the game!
startGame();


